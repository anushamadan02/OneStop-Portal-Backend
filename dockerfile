FROM node:alpine
COPY . /
WORKDIR /
CMD node server.js