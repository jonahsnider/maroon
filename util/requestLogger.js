const signale = require('signale');

module.exports = (req, res, next) => {
  signale.scope('requests', req.ip).debug({
    prefix: req.method,
    message: req.originalUrl || req.url,
    suffix: res.statusCode
  });

  next();
};
