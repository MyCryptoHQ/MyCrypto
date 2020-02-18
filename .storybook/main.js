const path = require('path');

module.exports = {
  stories: ['../common/**/*.stories.(tsx|mdx)'],

  addons: [
    'storybook-addon-designs/register',
    'storybook-addon-styled-component-theme/dist/register',
    '@storybook/addon-a11y/register',
    '@storybook/addon-docs'
  ],

  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: [require.resolve('babel-loader')]
    });

    config.resolve.extensions.push('.ts', '.tsx');
    config.resolve.modules.push(
      path.resolve(__dirname, '../common'),
      path.resolve(__dirname, '..')
    );

    config.node = {
      fs: 'empty',
      child_process: 'empty'
    };

    return config;
  }
};
