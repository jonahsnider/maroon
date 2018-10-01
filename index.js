const signale = require('signale');
const getID = require('./util/getID');
const downloadVideo = require('./util/downloadVideo');
const searchVideo = require('./util/searchVideo');
const logger = require('koa-logger');
const koaBody = require('koa-body');
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

signale.start('maroon started');

router
  .get('/', ctx => {
    ctx.body = 'henlo fremd';
  })
  .post('/api/download', koaBody(), async ctx => {
    const { query } = ctx.request.body;
    if (!query) {
      ctx.throw(400, 'videoResolvable is required');
    }

    if (getID(query)) {
      // If a URL or ID was passed in
      ctx.body = downloadVideo(query);
    } else {
      // If a search term was passed in
      const ytVideo = await searchVideo(query);
      if (!ytVideo) ctx.throw(204, 'no video found');
      ctx.body = downloadVideo(ytVideo.id);
    }
  });

app.use(logger());
app.use(router.routes());

if (!module.parent) app.listen(3000);
