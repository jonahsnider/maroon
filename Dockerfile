FROM node:16.8.0-alpine AS builder

WORKDIR /usr/src/builder

ENV NODE_ENV production

EXPOSE 3000

COPY public ./public
COPY src ./src

COPY package.json tsconfig.json next-env.d.ts next.config.js yarn.lock ./

RUN ["yarn", "install", "--production=true"]

RUN ["yarn", "build"]

FROM node:16.8.0-alpine AS app
WORKDIR /usr/src/maroon

COPY package.json ./

COPY --from=builder /usr/src/builder/.next .next
COPY --from=builder /usr/src/builder/public public
COPY --from=builder /usr/src/builder/node_modules node_modules

ENTRYPOINT ["yarn", "start"]
