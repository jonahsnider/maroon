/* eslint-disable camelcase */
module.exports = {
  apps: [{
    name: 'web',
    script: 'index.js',

    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: true,
    max_memory_restart: '200M',

    // Gross code ahead:
    env: {
      NODE_ENV: 'development',
      SQREEN_TOKEN: process.env.SQREEN_TOKEN,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      SQREEN_TOKEN: process.env.SQREEN_TOKEN,
      YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      SENTRY_DSN: process.env.SENTRY_DSN,
      PORT: 80
    }
  }],

  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
