const fs = require('fs');
const path = require('path');
const Movie = require('../models/movie');
const { User } = require('../models/user');
const {
  startTorrentDownload,
  prioritizePieces,
  activeDownloads
} = require('../services/download.service');
const { needsTranscoding, transcodeToMp4 } = require('../services/transcode.service');

const markWatched = async (userId, movie) => {
  await User.updateOne(
    { _id: userId, 'watchHistory.movieId': { $ne: movie._id } },
    { $push: { watchHistory: { movieId: movie._id } } }
  );
  await Movie.updateOne({ _id: movie._id }, { lastWatchedAt: new Date() });
};

const streamMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findOne({ tmdbId: Number(movieId) });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const user = await User.findById(req.user.id);
    const quality = user ? user.qualityPreference : null;

    let magnetobj;
    if (quality) {
      magnetobj = movie.magnetLinks.find(m => m.quality === quality);
    }

    if (!magnetobj) {
      magnetobj = movie.magnetLinks.find(m => m.quality === '720p');
    }

    if (!magnetobj) {
      magnetobj = movie.magnetLinks[0];
    }

    if (!magnetobj) {
      return res.status(404).json({ error: 'Movie magnet link not found' });
    }

    if (movie.isDownloaded && movie.filePath && fs.existsSync(movie.filePath)) {
      console.log('Streaming from disk!');
      let fileSize = movie.fileSize;
      if (!fileSize) {
        // Backfill for movies downloaded before fileSize was persisted.
        fileSize = fs.statSync(movie.filePath).size;
        await Movie.updateOne({ _id: movie._id }, { fileSize });
      }
      await markWatched(req.user.id, movie);
      streamFile(req, res, movie.filePath, fileSize, movieId, null);
      return;
    }

    if (movie.isDownloaded && movie.filePath && !fs.existsSync(movie.filePath)) {
      console.log('File missing, resetting...');
      await Movie.findOneAndUpdate(
        { tmdbId: movieId },
        { isDownloaded: false, filePath: null }
      );
    }

    console.log('starting torrent download...');
    const download = await startTorrentDownload(
      magnetobj.magnetLink,
      String(movie.tmdbId),
      magnetobj.quality
    );
    console.log('✅ streaming started!');
    await markWatched(req.user.id, movie);
    streamFile(req, res, download.filePath, download.fileSize, movieId, download);

  } catch (err) {
    console.log('❌ ERROR:', err.message);
    if (!res.headersSent) {
      res.status(err.status || 500).json({ error: err.message });
    }
  }
};

const activeReadStreams = {};

const streamFile = (req, res, filePath, fileSize, movieId, download) => {

  if (res.headersSent) return;

  const fileName = download ? download.fileName : path.basename(filePath);
  const isStillDownloading = !!download;

  console.log('📁 File name:', fileName);
  console.log('🔄 Needs transcoding:', needsTranscoding(fileName));

  if (needsTranscoding(fileName)) {
    console.log(`Transcoding: ${fileName}`);
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Transfer-Encoding', 'chunked');

    const inputStream = (download && download.file)
      ? download.file.createReadStream()
      : fs.createReadStream(filePath);

    const transcodedStream = transcodeToMp4(inputStream);
    req.on('close', () => transcodedStream.destroy());
    transcodedStream.pipe(res);
    return;
  }

  const range = req.headers.range;

  // ── No Range Header → full file, status 200 ──
  if (!range) {
    const headers = {
      'Content-Type':  'video/mp4',
      'Accept-Ranges': 'bytes',
    };
    // Only promise a length when the whole file is on disk.
    if (!isStillDownloading) {
      headers['Content-Length'] = fileSize;
    }
    res.writeHead(200, headers);

    const readStream = (download && download.file)
      ? download.file.createReadStream()
      : fs.createReadStream(filePath);

    res.on('close', () => readStream.destroy());
    readStream.pipe(res);
    return;
  }

  // ── Parse Range ──
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) {
    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
    res.end();
    return;
  }

  const start = match[1] !== '' ? parseInt(match[1], 10) : 0;

  if (start >= fileSize) {
    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
    res.end();
    return;
  }

  if (isStillDownloading) {
    const end = match[2] !== '' ? parseInt(match[2], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    prioritizePieces(download, start);

    res.writeHead(206, {
      'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges':  'bytes',
      'Content-Length': chunkSize,
      'Content-Type':   'video/mp4',
    });

    const readStream = download.file.createReadStream({ start, end });
    console.log(`🎬 Torrent stream: ${start} → ${end}`);

    res.on('close', () => readStream.destroy());
    readStream.on('error', () => { if (!res.writableEnded) res.end(); });
    readStream.pipe(res);
    return;
  }

  // ── FULLY DOWNLOADED: proper ranged read from disk with Content-Length ──
  const end = match[2] !== '' ? parseInt(match[2], 10) : fileSize - 1;

  if (end >= fileSize || start > end) {
    res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
    res.end();
    return;
  }

  const chunkSize = end - start + 1;

  res.writeHead(206, {
    'Content-Range':  `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges':  'bytes',
    'Content-Length': chunkSize,
    'Content-Type':   'video/mp4',
  });

  const readStream = fs.createReadStream(filePath, { start, end });
  console.log(`💾 Disk stream: ${start} → ${end}`);

  res.on('close', () => readStream.destroy());
  readStream.pipe(res);
};

module.exports = { streamMovie };