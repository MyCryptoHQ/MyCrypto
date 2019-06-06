const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const { spawn } = require('child_process');

const LogPlugin = require('./plugins/serverLog');
const ClearDistPlugin = require('./plugins/clearDist');

// @TODO: replace these definitions by a simple
// webpack.common.js import
const makeConfig = require('./makeConfig');
const projectConfig = require('./config');
const devConfig = makeConfig({
  isProduction: false,
  isElectronBuild: true
});
const HTTP_PORT = 3000;

// Transpile the files that are needed by the electron renderer
// process and watch their changes.
const electronRendererConfig = merge.smartStrategy({
  'module.rules.use': 'replace',
})(devConfig, {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    contentBase: path.resolve(projectConfig.path.output),
    historyApiFallback: true,
    progress: false,
    hot: true,
    https: false,
    port: HTTP_PORT,
    noInfo: true,               // Silence bundle information
    clientLogLevel: 'warning',  // Silence [WDS] && [HMR] output in console
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    },
  },

  module: {
    rules: [
      // @TODO: This should most probably be our base loader in
      // webpack.common.js once we create it.
      {
        test: /\.(ts|tsx)$/,
        include: [
          projectConfig.path.src,
          projectConfig.path.shared,
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          }
        }],
      },
    ],
  },

  resolve: {
    // Allow react ^16.3 features with RHL
    // https://github.com/gaearon/react-hot-loader/issues/1227#issuecomment-482514844
    // @TODO: move too shared config to share with electron.
    alias: { 'react-dom': '@hot-loader/react-dom' },
  },

  plugins: [
    new ClearDistPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new LogPlugin(HTTP_PORT),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
})

module.exports = electronRendererConfig;
