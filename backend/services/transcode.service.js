const ffmpeg = require('fluent-ffmpeg');
const { PassThrough } = require('stream');

const needsTranscoding = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  return !['mp4', 'webm'].includes(ext);
};

const transcodeToMp4 = (inputStream) => {
  const passthrough = new PassThrough();

  ffmpeg(inputStream)
    .outputFormat('mp4')
    .videoCodec('libx264')
    .audioCodec('aac')
    .outputOptions([
      '-preset ultrafast',
      '-movflags frag_keyframe+empty_moov+default_base_moof',
      '-crf 28'
    ])
    .on('start', () => console.log('🎬 FFmpeg transcoding started'))
    .on('error', (err) => {
      console.log('❌ FFmpeg error:', err.message);
      passthrough.destroy(err);
    })
    .on('end', () => console.log('✅ FFmpeg transcoding done'))
    .pipe(passthrough, { end: true });

  return passthrough;
};

module.exports = { needsTranscoding, transcodeToMp4 };