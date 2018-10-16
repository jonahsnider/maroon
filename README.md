<img src="./public/img/logo.png" width="25%" align="right">

# maroon

[![Realtime application protection](https://s3-eu-west-1.amazonaws.com/sqreen-assets/badges/20171107/sqreen-light-badge.svg)](https://www.sqreen.io/?utm_source=badge) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pizzafox/maroon/tree/master)

Maroon is an Express powered web app for downloading YouTube music videos.

## Usage

## Self hosting

### Environment variables

All environment variables are optional, but you should provide a YouTube Data API v3 key and the site URL to utilize the most features.

| Key               | Description                                             | Optional | Default |
|-------------------|---------------------------------------------------------|----------|---------|
| `PM2_PUBLIC_KEY`  | Public key for PM2+ integration                         | Yes      |         |
| `PM2_SECRET_KEY`  | Secret key for PM2+ integration                         | Yes      |         |
| `PORT`            | Port to listen on                                       | Yes      | 3000    |
| `SENTRY_DSN`      | URI for error logging on Sentry                         | Yes      |         |
| `SQREEN_TOKEN`    | Token to use for protecting the application with Sqreen | Yes      |         |
| `URL`             | URL of the instance                                     | Yes      |         |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key used for searching for videos   | Yes      |         |

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pizzafox/maroon/tree/master)

### Node.js

1. Install prerequisites
    - [Node.js](https://nodejs.org) `8.x.x`
    - [Yarn](https://yarnpkg.com)
2. Download the source code
    - `git clone https://github.com/pizzafox/maroon.git`
3. Install dependencies
    - `yarn`
4. Configure environment variables (all are optional)
5. Start application
    - `yarn start`
