const path = require('path');
const merge = require('webpack-merge');
const custom = require('../webpack_config/development');

module.exports = {
  stories: ['../src/**/*.stories.(tsx|mdx)'],

  addons: [
    'storybook-addon-designs/register',
    'storybook-addon-styled-component-theme/dist/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs'
  ],

  webpackFinal: async config => {
    // Remove storybooks handling of assets in favor of our own.
    config.module.rules = config.module.rules.filter(rule => !rule.test.toString().includes('svg'));

    // Remove storybooks css config
    config.module.rules = config.module.rules.filter(rule => !rule.test.toString().includes('css'));

    // Merge storybook and our custom webpack_config/development.js
    return merge.smart(
      config,

      {
        resolve: custom.resolve,
        module: {
          rules: [...custom.module.rules]
        }
      },
      // Necessary to launch @storybook
      {
        node: {
          fs: 'empty',
          child_process: 'empty'
        }
      }
    );
  }
};
