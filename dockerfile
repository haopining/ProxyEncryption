FROM node:18-alpine

WORKDIR /usr/src
ADD package.json .
ADD package-lock.json .

RUN npm install -g nodemon
RUN npm install

CMD ["nodemon", "index.js"]