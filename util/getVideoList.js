const ytdl = require('ytdl-core');

module.exports = videoResolvables => {
  // Empty validated array of video IDs
  let videos = [];
  const invalidVideos = [];

  videoResolvables.forEach(videoIDResolvable => {
    // Check if the video ID resolvable is valid
    if (ytdl.validateURL(videoIDResolvable) || ytdl.validateID(videoIDResolvable)) {
      // Add the ID for the video to the array
      videos.push(ytdl.getVideoID(videoIDResolvable));
    } else {
      // Alert the user that the video ID resolvable provided was invalid
      invalidVideos.push(videoIDResolvable);
    }
  });

  // Remove duplicate unique video IDs
  videos = videos.filter((elem, pos) => videos.indexOf(elem) === pos);

  return { videos, invalidVideos };
};
