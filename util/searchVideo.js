const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);


module.exports = query => youtube.searchVideos(query, 1).then(videos => videos[0]);
