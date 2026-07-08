const fs = require('fs');
const path = require('path');
const Movie = require('../models/movie');

const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const DOWNLOAD_DIR = path.join(__dirname, '../movies_downloads');

const deleteDownloadFolder = (filePath) => {
  const relative = path.relative(DOWNLOAD_DIR, filePath);
  const topLevelDir = relative.split(path.sep)[0];
  const downloadDir = path.join(DOWNLOAD_DIR, topLevelDir);
  if (fs.existsSync(downloadDir)) {
    fs.rmSync(downloadDir, { recursive: true, force: true });
  }
};

const cleanupUnwatchedMovies = async () => {
  const movies = await Movie.find({ isDownloaded: true, filePath: { $ne: null } });
  const now = Date.now();

  for (const movie of movies) {
    const lastActivity = movie.lastWatchedAt || movie.updatedAt || movie.createdAt;
    if (now - new Date(lastActivity).getTime() < ONE_MONTH_MS) continue;

    console.log(`🗑️ Removing unwatched download: ${movie.movieName} (last activity: ${lastActivity})`);
    try {
      deleteDownloadFolder(movie.filePath);
    } catch (err) {
      console.log(`⚠️ Failed to delete files for ${movie.movieName}:`, err.message);
    }

    movie.isDownloaded = false;
    movie.filePath = undefined;
    movie.lastWatchedAt = undefined;
    await movie.save();
  }
};

module.exports = { cleanupUnwatchedMovies };
