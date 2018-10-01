const ytdl = require('ytdl-core');

module.exports = videoID => {
  // Get an audio-only ReadableStream
  const stream = ytdl(videoID, {
    quality: 'highestaudio',
    filter: 'audioonly'
  });


  // Send off the ReadableStream
  return stream;
};
