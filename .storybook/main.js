const path = require('path');
const merge = require('webpack-merge');
const custom = require('../webpack_config/development');

module.exports = {
  stories: ['../common/**/*.stories.(tsx|mdx)'],

  addons: [
    'storybook-addon-designs/register',
    'storybook-addon-styled-component-theme/dist/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs'
  ],

  webpackFinal: async config => {
    return merge.smart(
      config,
      // Use the existing dev webpack_config
      {
        resolve: custom.resolve,
        module: {
          rules: custom.module.rules
        }
      },
      // Necessary to launch @storybook
      {
        node: {
          fs: 'empty',
          child_process: 'empty'
        }
      }
    )
  }
};
