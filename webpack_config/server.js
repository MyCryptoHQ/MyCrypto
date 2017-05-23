'use strict'
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.dev')
const config = require('./config')
const LogPlugin = require('./log-plugin')

const app = express()

const port = config.port
webpackConfig.entry.client = [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?reload=true',
    'webpack/hot/only-dev-server',
    webpackConfig.entry.client
]

webpackConfig.plugins.push(new LogPlugin(port))

let compiler

try {
    compiler = webpack(webpackConfig)
} catch (err) {
    console.log(err.message)
    process.exit(1)
}

const devMiddleWare = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    quiet: false,
    inline: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*'
    }
})
app.use(devMiddleWare)
app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log
}))

const mfs = devMiddleWare.fileSystem
const file = path.join(webpackConfig.output.path, 'index.html')

devMiddleWare.waitUntilValid()

app.get('*', (req, res) => {
    devMiddleWare.waitUntilValid(() => {
        const html = mfs.readFileSync(file)
        res.end(html)
    })
})

app.listen(port)
