# FROM node:12.18-alpine as builder
# COPY ["package.json", "yarn.lock", "./"]
# RUN yarn install
# COPY --from=builder node_modules node_modules

FROM node:12.18-alpine
WORKDIR /usr/src/server
RUN apk --no-cache add python make g++