const merge = require('webpack-merge');
const path = require('path');
const defaultConfig = require('../webpack_config/config');
const commonConfig = require('../webpack_config/common');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  reactOptions: {
    fastRefresh: true
  },
  webpackFinal: async (config) => {
    return merge.smart(config, {
      resolve: commonConfig.resolve,
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            include: [
              path.join(defaultConfig.path.src, 'vendor'),
              path.join(defaultConfig.path.root, 'node_modules/typeface-lato')
            ]
          },

          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader']
          }
        ]
      }
    });
  }
};
