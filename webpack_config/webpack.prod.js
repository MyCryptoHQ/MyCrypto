'use strict'
process.env.NODE_ENV = 'production'
process.env.REACT_WEBPACK_ENV = 'dist'

const exec = require('child_process').execSync
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
// const OfflinePlugin = require('offline-plugin')
const base = require('./webpack.base')
const config = require('./config')


exec('rm -rf dist/')
base.devtool = 'cheap-source-map'
base.module.loaders.push(
    {
        test: /\.less$/,
        use: ExtractTextPlugin.extract(
            {
                fallback: 'style-loader',
                use: ['css-loader','less-loader']
            }
        )
    },
    {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(
            {
                fallback: 'style-loader',
                use: 'css-loader'
            }
        )
    }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(
            {
                fallback: 'style-loader',
                use: ['css-loader', 'sass-loader']
            }
        ),
    }
)
// a white list to add dependencies to vendor chunk
base.entry.vendor = config.vendor
// use hash filename to support long-term caching
base.output.filename = '[name].[chunkhash:8].js'
// add webpack plugins
base.plugins.push(
    new ProgressPlugin(),
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false
        },
        output: {
            comments: false
        }
    }),
    // extract vendor chunks
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.[chunkhash:8].js'
    })
    // For progressive web apps
    // new OfflinePlugin({
    //   relativePaths: false,
    //   AppCache: false,
    //   ServiceWorker: {
    //     events: true
    //   }
    // })
)

// minimize webpack output
base.stats = {
    // Add children information
    children: false,
    // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: false,
    // Add built modules information to chunk information
    chunkModules: false,
    chunkOrigins: false,
    modules: false
}

module.exports = base
