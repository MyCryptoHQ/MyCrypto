'use strict';
const path = require('path');
const express = require('express');
const webpack = require('webpack');
const https = require('https');
const fs = require('fs');
const webpackConfig = require('./webpack.dev');
const config = require('./config');
const LogPlugin = require('./log-plugin');

const app = express();

const port = config.port;
webpackConfig.entry.client = [
  'react-hot-loader/patch',
  'webpack-hot-middleware/client?reload=true',
  'webpack/hot/only-dev-server',
  webpackConfig.entry.client
];

webpackConfig.plugins.push(new LogPlugin(port));

let compiler;

try {
  compiler = webpack(webpackConfig);
} catch (err) {
  console.log(err.message);
  process.exit(1);
}

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
  inline: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*'
  },
  watchOptions: {
    aggregateTimeout: 100
  }
});
app.use(devMiddleWare);
app.use(
  require('webpack-hot-middleware')(compiler, {
    log: console.log
  })
);

const mfs = devMiddleWare.fileSystem;
const file = path.join(webpackConfig.output.path, 'index.html');

devMiddleWare.waitUntilValid();

app.get('*', (req, res) => {
  devMiddleWare.waitUntilValid(() => {
    const html = mfs.readFileSync(file);
    res.end(html);
  });
});

if (process.env.HTTPS) {
  let creds = {};
  try {
    creds.key = fs.readFileSync(path.resolve(__dirname, 'server.key'), 'utf8');
  } catch (err) {
    console.error('Failed to get SSL private key at webpack_config/server.key');
    console.error(err);
    process.exit(1);
  }

  try {
    creds.cert = fs.readFileSync(path.resolve(__dirname, 'server.crt'), 'utf8');
  } catch (err) {
    console.error('Failed to get SSL certificate at webpack_config/server.crt');
    console.error(err);
    process.exit(1);
  }

  const httpsApp = https.createServer(creds, app);
  httpsApp.listen(port);
} else {
  app.listen(port);
}
