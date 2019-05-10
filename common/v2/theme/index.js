import { light } from '@mycrypto/ui';

// Direct require to customise the webpack default scss loader
const COLORS = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!./colors.scss');

// Combine the themes in a single object to be consummed by SC ThemeProvider
const theme = Object.assign({}, light, {
  GAU: {
    COLORS
  }
});

export default theme;
