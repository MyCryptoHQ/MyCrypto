const merge = require('webpack-merge');
const path = require('path');
const commonConfig = require('../webpack_config/config');
const devConfig = require('../webpack_config/development');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  reactOptions: {
    fastRefresh: true
  },
  webpackFinal: async (config) => {
    return merge.smart(config, {
      resolve: devConfig.resolve,
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
            include: [
              path.join(commonConfig.path.src, 'vendor'),
              path.join(commonConfig.path.root, 'node_modules/typeface-lato')
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
