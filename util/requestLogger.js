const signale = require('signale');
const io = require('@pm2/io');

module.exports = (req, res, next) => {
  signale.scope('requests', req.ip).debug({
    prefix: req.method,
    message: req.originalUrl || req.url,
    suffix: res.statusCode
  });

  const reqsPerSec = io.metric({
    name: 'reqs/sec',
    type: 'meter'
  });

  reqsPerSec.mark();

  next();
};
