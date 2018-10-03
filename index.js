if (process.env.SQREEN_TOKEN) require('sqreen');

const signale = require('signale');
const getID = require('./util/getID');
const ytdl = require('ytdl-core');
const searchVideo = require('./util/searchVideo');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ms = require('ms');
const RateLimit = require('express-rate-limit');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
const express = require('express');
const app = express();
const { renderFile } = require('ejs');

signale.start('maroon started');

if (!process.env.YOUTUBE_API_KEY) signale.warn('No YouTube API key provided, search will be disabled');

process.on('unhandledRejection', (reason, p) => {
  signale.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const limiter = new RateLimit({
  windowMs: ms('5 minutes'),
  max: 100,
  delayMs: 0
});

app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'));
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine('html', renderFile);
app.set('view engine', 'html');

const renderTemplate = (res, template, data = {}) => {
  const baseData = {
    hostname: process.env.DOCKER_CLUSTER ? require('os').hostname() : null
  };
  res.render(template, Object.assign(baseData, data));
};

app
  .get('/', (req, res) => {
    renderTemplate(res, 'index.ejs', { search: !!process.env.YOUTUBE_API_KEY });
  })
  .get('/welcome', (req, res) => {
    renderTemplate(res, 'welcome.ejs');
  })
  .get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'img', 'favicon.ico'));
  })
  .post('/', async (req, res) => {
    const { query } = req.body;
    if (!query) {
      renderTemplate(res, 'error.ejs', { error: 'query was missing' });
      res.status(400);
      return res.end();
    }

    const options = {
      quality: 'highestaudio',
      filter: 'audioonly'
    };

    let videoID;
    let ytVideo;

    if (getID(query)) {
      // If an ID or URL was passed in
      videoID = getID(query);
      ytVideo = await youtube.getVideoByID(videoID);
    } else if (process.env.YOUTUBE_API_KEY) {
      // If a search term was passed in
      ytVideo = await searchVideo(query);
      videoID = ytVideo.id;
    }

    if (!videoID) {
      renderTemplate(res, 'noVideos.ejs');
      res.status(204);
      res.send('no video found');
      return res.end();
    }

    res.attachment(`${ytVideo.title}.mp3`);

    return ytdl(videoID, options).pipe(res);
  });

app.use((req, res) => {
  if (req.accepts('html')) {
    renderTemplate(res, '404.ejs');
    res.status(404);
    res.end();
  }
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.listen(port);
signale.info(`listening on port ${port}`);
