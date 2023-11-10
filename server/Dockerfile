FROM node:18
LABEL authors="frcarlo"

RUN apt-get update && apt-get install jq usbutils inotify-tools  restic -y

# Create app directory

ENV UDEV=on
USER root

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
EXPOSE 3000
CMD [ "node", "server.js" ]