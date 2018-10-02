require('sqreen');
const signale = require('signale');
const getID = require('./util/getID');
const ytdl = require('ytdl-core');
const searchVideo = require('./util/searchVideo');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const ms = require('ms');
const RateLimit = require('express-rate-limit');
const express = require('express');
const app = express();
const { renderFile } = require('ejs');

signale.start('maroon started');

const limiter = new RateLimit({
  windowMs: ms('5 minutes'),
  max: 100,
  delayMs: 0
});

app.use(morgan('dev'));
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine('html', renderFile);
app.set('view engine', 'html');


app
  .get('/', (req, res) => {
    res.render('index.ejs');
  })
  .post('/', async (req, res) => {
    const { query } = req.body;
    if (!query) {
      res.render('error.ejs', { error: 'query was missing' });
      res.status(400);
      return res.end();
    }

    const options = {
      quality: 'highestaudio',
      filter: 'audioonly'
    };

    let videoID;
    if (query && getID(query)) {
      videoID = getID(query);
    } else {
      // If a search term was passed in
      videoID = (await searchVideo(query)).id;
      if (!videoID) {
        res.render('noVideos.ejs');
        res.status(204);
        res.send('no video found');
        return res.end();
      }
    }

    res.attachment('audio.mp3');

    return ytdl(videoID, options).pipe(res);
  });

app.use((req, res) => {
  if (req.accepts('html')) {
    res.render('404.ejs');
    res.status(404);
    res.end();
  }
});

app.listen(3000);
