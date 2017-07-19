FROM node:8.1.4

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet

COPY . .
