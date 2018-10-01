const ytdl = require('ytdl-core');

module.exports = videoResolvable => {
  // Check if the video ID resolvable is valid
  if (ytdl.validateURL(videoResolvable) || ytdl.validateID(videoResolvable)) {
    // Return the video ID
    return ytdl.getVideoID(videoResolvable);
  }

  return null;
};
