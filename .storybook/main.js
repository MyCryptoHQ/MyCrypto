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

    // Remove ignored storybook files
    custom.module.rules = custom.module.rules.filter(rule => {
      if(rule && rule.loader) {
        return !rule.loader.toString() === 'ignore-loader';
      }
      return true;
    });

    // Rewrite babel loader test
    const babelLoaderIndex = custom.module.rules.findIndex(rule => rule.test.toString().includes('tsx'));
    const babelLoader = custom.module.rules.splice(babelLoaderIndex, 1)[0];
    babelLoader.test = /\.tsx?$/;
    custom.module.rules = [
      babelLoader,
      ...custom.module.rules
    ];

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
