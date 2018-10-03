<img src="./public/img/logo.png" width="25%" align="right">

# maroon

[![Realtime application protection](https://s3-eu-west-1.amazonaws.com/sqreen-assets/badges/20171107/sqreen-light-badge.svg)](https://www.sqreen.io/?utm_source=badge) [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pizzafox/maroon/tree/master)

Maroon is an Express powered web app for downloading YouTube music videos.

## Usage

## Self hosting

### Environment variables

| Key               | Description                                             | Optional | Default |
|-------------------|---------------------------------------------------------|----------|---------|
| `PORT`            | Port to listen on                                       | Yes      | 3000    |
| `SQREEN_TOKEN`    | Token to use for protecting the application with Sqreen | Yes      |         |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key used for searching for videos   | Yes      |         |
| `URL`             | URL of the instance                                     | No       |         |

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/pizzafox/maroon/tree/master)

### Docker

1. Install prerequisites
    - [Docker Compose](https://docs.docker.com/compose/install/)
2. Download the `docker-compose.yml` example file
    - `wget https://raw.githubusercontent.com/pizzafox/maroon/master/docker-compose.yml.example -O docker-compose.yml`
3. Add in environment variables (most are optional)
4. Compose up
    - `docker-compose up`

### Node.js

1. Install prerequisites
    - [Node.js](https://nodejs.org) `8.x.x`
    - [Yarn](https://yarnpkg.com)
2. Download the source code
    - `git clone https://github.com/pizzafox/maroon.git`
3. Install dependencies
    - `yarn`
4. Configure environment variables
5. Start application
    - `yarn start`
