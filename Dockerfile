FROM node:8.12.0-alpine

LABEL maintainer "Jonah Snider <me@jonahsnider.ninja> (jonahsnider.ninja)"

# Create app directory
WORKDIR /usr/src/maroon

# Install Yarn
RUN apk update
RUN apk add yarn

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn

# Bundle app source
COPY . .

# Initialize environment variables
ENV SQREEN_TOKEN=
ENV YOUTUBE_API_KEY=
ENV PORT=3000
ENV URL=
ENV PM2_PUBLIC_KEY=
ENV PM2_SECRET_KEY=
ENV SENTRY_DSN=

EXPOSE 3000

CMD [ "yarn", "start" ]
