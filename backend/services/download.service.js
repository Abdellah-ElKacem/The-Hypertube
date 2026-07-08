const torrentStream = require('torrent-stream');
const path = require('path');
const fs = require('fs');
const Movie = require('../models/movie');

const DOWNLOAD_DIR = path.join(__dirname, '../movies_downloads');

if (!fs.existsSync(DOWNLOAD_DIR)){
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

const activeDownloads = {};
const READY_TIMEOUT_MS = 20000;
const MAX_CONCURRENT_DOWNLOADS = 3;
const inProgressDownloads = new Set();

const startTorrentDownload = (magnetLink, movieId, quality) => {
  return new Promise((resolve, reject) => {

    const downloadKey = `${movieId}-${quality}`;

    if (activeDownloads[downloadKey]) {
      console.log('reusing existing download');
      return resolve(activeDownloads[downloadKey]);
    }

    if (!inProgressDownloads.has(downloadKey) && inProgressDownloads.size >= MAX_CONCURRENT_DOWNLOADS) {
      const err = new Error('Too many downloads in progress, please try again later');
      err.status = 429;
      return reject(err);
    }

    inProgressDownloads.add(downloadKey);
    const releaseSlot = () => inProgressDownloads.delete(downloadKey);

    const engine = torrentStream(magnetLink, {
      path: path.join(DOWNLOAD_DIR, downloadKey),
      verify: true,
      uploads: false
    });

    let readyTimedOut = false;
    const readyTimeout = setTimeout(() => {
      readyTimedOut = true;
      console.log(`${downloadKey} - No peers found within ${READY_TIMEOUT_MS / 1000}s`);
      engine.destroy(() => console.log('Engine destroyed'));
      releaseSlot();
      const err = new Error('No peers found for this torrent');
      err.status = 404;
      reject(err);
    }, READY_TIMEOUT_MS);

    engine.on('ready', () => {
      if (readyTimedOut) return;
      clearTimeout(readyTimeout);

      const videoFile = engine.files
        .filter(f =>
          f.name.endsWith('.mp4') ||
          f.name.endsWith('.mkv') ||
          f.name.endsWith('.avi') ||
          f.name.endsWith('.mov')
        )
        .sort((a, b) => b.length - a.length)[0];

      if (!videoFile) {
        releaseSlot();
        const err = new Error('No video file found in torrent');
        err.status = 404;
        return reject(err);
      }

      videoFile.select();

      const progressInterval = setInterval(() => {
        const downloaded = engine.swarm.downloaded;
        const total = videoFile.length;
        const percent = ((downloaded / total) * 100).toFixed(2);

        console.log(`=> ${downloadKey} - Downloaded: ${percent}%`);

        if (downloaded >= total) {
          clearInterval(progressInterval);
          console.log(` ${downloadKey} - Download complete!`);
        }
      }, 2000);

      activeDownloads[downloadKey] = {
        engine,
        file:     videoFile,
        filePath: path.join(DOWNLOAD_DIR, downloadKey, videoFile.path),
        fileName: videoFile.name,
        fileSize: videoFile.length,
      };

      let time = 0;
      let resolvedForStreaming = false;
      const checkReady = setInterval(async () => {

        const downloaded = engine.swarm.downloaded;
        const total = videoFile.length;
        const percent = ((downloaded / total) * 100).toFixed(2);
        time++;

        if (downloaded >= total) {
          clearInterval(checkReady);
          clearInterval(progressInterval);
          releaseSlot();
          try {
            await Movie.findOneAndUpdate(
              { tmdbId: movieId },
              {
                isDownloaded: true,
                filePath: activeDownloads[downloadKey].filePath,
                fileSize: activeDownloads[downloadKey].fileSize
              }
            );
            console.log(` ${downloadKey} - Saved to DB!`);
          } catch (err) {
            console.log(` DB update failed:`, err.message);
          }
          return;
        }

        if (!resolvedForStreaming && percent >= 0.5) {
          console.log(`0.5% downloaded - starting stream!`);
          resolvedForStreaming = true;
          resolve(activeDownloads[downloadKey]);
        }

        if (!resolvedForStreaming && time >= 60 && percent == 0) {
          console.log('no seeder found!');
          clearInterval(checkReady);
          clearInterval(progressInterval);
          engine.destroy(() => {
            console.log(' Engine destroyed');
          });
          delete activeDownloads[downloadKey];
          releaseSlot();
          const err = new Error('Download timeout - no seeders available');
          err.status = 404;
          reject(err);
        }

      }, 1000);
    });

    engine.on('error', (err) => {
      clearTimeout(readyTimeout);
      releaseSlot();
      reject(err);
    });

  });
};


const prioritizePieces = (download, seekPosition) => {
  if (!download) return;

  const engine     = download.engine;
  const videoFile  = download.file;
  const fileOffset = videoFile.offset || 0;
  const fileSize   = videoFile.length;
  const pieceLength = engine.torrent.pieceLength;

  console.log(`Seeking to byte: ${seekPosition}`);

  const startByte = fileOffset + seekPosition;
  const endByte   = Math.min(
    startByte + (1024 * 1024 * 30),
    fileOffset + fileSize - 1
  );

  const startPiece = Math.floor(startByte / pieceLength);
  const endPiece   = Math.floor(endByte   / pieceLength);

  console.log(`Prioritizing pieces ${startPiece} → ${endPiece}`);

  for (let i = startPiece; i <= endPiece; i++) {
    engine.critical(i);
  }
};

module.exports = { startTorrentDownload, prioritizePieces, activeDownloads };