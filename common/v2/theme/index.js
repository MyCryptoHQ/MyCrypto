import { light } from '@mycrypto/ui';

export { COLORS, BREAK_POINTS } from './constants';

// Direct require to customise the webpack default scss loader
const COLORS = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!./colors.scss');

// Combine the themes in a single object to be consummed by SC ThemeProvider
export const GAU_THEME = Object.assign({}, light, {
  GAU: {
    COLORS
  }
});
