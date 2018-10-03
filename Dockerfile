FROM node:8.11.4-alpine

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
ENV NODE_ENV=production
ENV SQREEN_TOKEN=
ENV YOUTUBE_API_KEY=
ENV PORT=3000
ENV URL=

EXPOSE 3000

CMD [ "yarn", "start" ]
