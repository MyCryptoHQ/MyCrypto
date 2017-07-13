FROM node:7.7.2

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .
