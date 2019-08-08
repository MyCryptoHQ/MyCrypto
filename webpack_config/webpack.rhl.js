const merge = require('webpack-merge');
const webpack = require('webpack');
const LogPlugin = require('./plugins/serverLog');
// @TODO: replace these definitions by a simple
// webpack.common.js import
const makeConfig = require('./makeConfig');
const projectConfig = require('./config');
const devConfig = makeConfig({
  isProduction: false,
  isElectronBuild: !!process.env.BUILD_ELECTRON
});

const HTTPS_PORT = 3000;
// Take the common config and adapt it for dev purposes
const rhlConfig = merge.smartStrategy({
  'module.rules.use': 'replace'
})(devConfig, {
  devServer: {
    contentBase: projectConfig.path.output,
    historyApiFallback: true,
    progress: true,
    hot: true,
    https: true,
    port: HTTPS_PORT,
    noInfo: true,               // Silence bundle information
    clientLogLevel: 'warning',  // Silence [WDS] && [HMR] output in console
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*'
    }
  },

  module: {
    rules: [
      // @TODO: This should most probably be our base loader in
      // webpack.common.js once we create it.
      {
        test: /\.(ts|tsx)$/,
        include: [
          projectConfig.path.src,
          projectConfig.path.shared
        ],
        use: [{
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          }
        }],
      }
    ],
  },

  resolve: {
    // Allow react ^16.3 features with RHL
    // https://github.com/gaearon/react-hot-loader/issues/1227#issuecomment-482514844
    alias: { 'react-dom': '@hot-loader/react-dom' }
  },

  externals: [
    {
      xmlhttprequest: 'XMLHttpRequest'
    }
  ],

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LogPlugin(HTTPS_PORT),
  ]
})

module.exports = rhlConfig;
