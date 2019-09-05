import { light } from '@mycrypto/ui';

// Direct require to customise the webpack default scss loader
const GAU_COLORS = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!./colors.scss');

// Combine the themes in a single object to be consummed by SC ThemeProvider
export const GAU_THEME = Object.assign({}, light, {
  GAU: {
    COLORS: GAU_COLORS
  }
});

export const COLORS = {
  DARK_SLATE_BLUE: '#163150',
  GREYISH_BROWN: '#424242',
  BRIGHT_SKY_BLUE: '#1eb8e7',
  SILVER: '#f7f7f7',
  DARK_SILVER: '#ccc',
  DARK_GREY: '#e5ecf3',
  PASTEL_RED: '#ef4747',
  WHITE: '#fff',
  SUCCESS_GREEN: '#5dba5a',
  GOLD: '#FFD166'
};

export const BREAK_POINTS = {
  SCREEN_XS: '512px',
  SCREEN_SM: '850px',
  SCREEN_MD: '1080px',
  SCREEN_LG: '1280px',
  SCREEN_XL: '1440px',
  SCREEN_XXL: '1600px'
};
