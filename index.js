if (process.env.SQREEN_TOKEN) require('sqreen');

const logger = require('signale');
const getID = require('./util/getID');
const ytdl = require('ytdl-core');
const requestLogger = require('./util/requestLogger');
const path = require('path');
const bodyParser = require('body-parser');
const ms = require('ms');
const RateLimit = require('express-rate-limit');
const KeyvStore = require('rate-limit-keyv');
const Keyv = require('keyv');
const express = require('express');
const app = express();
const { renderFile } = require('ejs');
const packageJSON = require('./package.json');
const compression = require('compression');
const helmet = require('helmet');

logger.start(`maroon started in ${process.env.NODE_ENV} mode`);

if (!process.env.YOUTUBE_API_KEY) {
  logger.warn('No YouTube API key provided, search will be disabled');
}

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const limiter = new RateLimit({
  store: new KeyvStore(new Keyv({ namespace: 'rate-limit' })),
  windowMs: ms('5 minutes'),
  max: 250
});

app.use(compression());

if (process.env.SQREEN_TOKEN) {
  logger.info('using Sqreen');

  app.use(helmet({
    frameguard: false,
    noSniff: false,
    xssFilter: false
  }));
} else {
  logger.info('not using Sqreen');
  app.use(helmet());
}

app.use(requestLogger);
app.use(limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.engine('html', renderFile);
app.set('view engine', 'html');

const renderTemplate = (res, template, data = {}) => {
  const baseData = {
    siteData: {
      url: process.env.URL,
      description: packageJSON.description
    },
    instance: process.env.NODE_APP_INSTANCE || null,
    version: packageJSON.version
  };
  res.render(template, Object.assign(baseData, data));
};

app
  .get('/', (req, res) => {
    renderTemplate(res, 'index.ejs', {
      search: !!process.env.YOUTUBE_API_KEY
    });
  })
  .get('/welcome', (req, res) => {
    renderTemplate(res, 'welcome.ejs');
  })
  .get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'img', 'favicon.ico'));
  })
  .get('/keybase.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'keybase.txt'));
  })
  // eslint-disable-next-line consistent-return
  .post('/', async (req, res) => {
    const { query, filter, quality } = req.body;

    if (!query) {
      renderTemplate(res, 'error.ejs', {
        error: 'query was missing'
      });
      res.status(400);
      return res.end();
    }

    if (!filter) {
      renderTemplate(res, 'error.ejs', {
        error: 'filter type was missing'
      });
      res.status(400);
      return res.end();
    }

    if (!quality) {
      renderTemplate(res, 'error.ejs', {
        error: 'quality was missing'
      });
      res.status(400);
      return res.end();
    }

    if (!['audioonly', 'audioandvideo'].includes(filter)) {
      renderTemplate(res, 'error.ejs', {
        error: 'filter type was invalid value'
      });
      res.status(400);
      return res.end();
    }

    if (!['highest', 'lowest'].includes(quality)) {
      renderTemplate(res, 'error.ejs', {
        error: 'quality type was invalid value'
      });
      res.status(400);
      return res.end();
    }

    const options = {
      quality: filter === 'audioonly' ? 'highestaudio' : 'highest',
      filter
    };

    if (filter === 'audioonly' && quality === 'highest') {
      options.quality = 'highestaudio';
    } else if (filter === 'audioonly') {
      options.quality = 'lowest';
    } else if (filter === 'audioandvideo' && quality === 'highest') {
      options.quality = 'highest';
    } else {
      options.quality = 'lowest';
    }

    let videoID;

    if (getID(query)) {
      // If an ID or URL was passed in
      videoID = getID(query);
    } else if (process.env.YOUTUBE_API_KEY) {
      // If a search term was passed in
      const searchVideo = require('./util/searchVideo');

      videoID = (await searchVideo(query)).id;
    }

    if (!videoID) {
      renderTemplate(res, 'noVideos.ejs');
      res.status(204);
      return res.end();
    }

    const data = await ytdl.getBasicInfo(videoID);
    const displayName = data.title;

    res.attachment(`${displayName}.${filter === 'audioonly' ? 'mp3' : 'mp4'}`);

    const stream = ytdl(videoID, options);

    stream.on('error', error => {
      logger.error('Error occurred while streaming video', error);
      res.status(502);
    });

    stream.pipe(res);
  });

app.use((req, res) => {
  if (req.accepts('html')) {
    renderTemplate(res, '404.ejs');
    res.status(404);
    res.end();
  }
});

const port = process.env.PORT;

app.listen(port);
logger.info(`listening on port ${port}`);
