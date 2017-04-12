'use strict'
const path = require('path')

module.exports = {
  port: 3000,
  title: 'React-Semantic.UI-starter',
  publicPath:  process.env.BUILD_GH_PAGES ? '/react-semantic.ui-starter/' : '/',
  srcPath: path.join(__dirname, './../common'),
  // add these dependencies to a standalone vendor bundle
  vendor: [
    'react', 'react-dom', 'react-router', 'redux', 'react-router-redux', 'redux-thunk', 'semantic-ui-react', 'whatwg-fetch', 'semantic-ui-css/semantic.css'
  ],
  // enable babelrc
  babel: {
    babelrc: true
  },
  cssModules: false
}
