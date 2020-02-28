import { light } from '@mycrypto/ui';

// Direct require to customise the webpack default scss loader
export const GAU_COLORS = require('sass-extract-loader?{"plugins": ["sass-extract-js"]}!./colors.scss');

// Combine the themes in a single object to be consummed by SC ThemeProvider
export const GAU_THEME = Object.assign({}, light, {
  GAU: {
    COLORS: GAU_COLORS
  }
});

export const COLORS = {
  BLUE_BRIGHT: '#1eb8e7',
  BLUE_LIGHT: '#007896',
  BLUE_GREY: '#b5bfc7',
  BLUE_GREY_LIGHTEST: '#fafcfc',
  BLUE_DARK_SLATE: '#163150',
  BLUE_DARK: '#1c314e',

  LEMON_GRASS: '#99968C',
  SUCCESS_GREEN: '#5dba5a',
  ERROR_RED: '#FF5050',
  PASTEL_RED: '#ef4747',
  GOLD: '#FFD166',

  WHITE: '#fff',
  GREY_LIGHTEST: '#f7f7f7',
  GREY_LIGHTER: '#e5ecf3',
  GREY_LIGHT: '#D8D8D8',
  GREY: '#b7bfc6',
  GREY_DARK: '#7b8695',
  GREY_DARKER: '#7b8695',
  GREY_DARKEST: '#282D32',
  BLACK: '#000',

  GREY_GEYSER: '#d6dce5',
  GREY_ATHENS: '#e8eaed',
  GREYISH_BROWN: '#424242',

  PURPLE: '#A086F7',
  ORANGE: '#FA863F',
  GREEN: '#28a745',
  RED: '#FF0000'
};

export const BREAK_POINTS = {
  SCREEN_XS: '512px',
  SCREEN_SM: '850px',
  SCREEN_MD: '1080px',
  SCREEN_LG: '1280px',
  SCREEN_XL: '1440px',
  SCREEN_XXL: '1600px'
};

export const FONT_SIZE = {
  XS: '12px',
  SM: '14px',
  BASE: '16px',
  MD: '18px',
  LG: '20px',
  XL: '24px',
  XXL: '36px'
};

export const SPACING = {
  XS: '5px',
  SM: '10px',
  BASE: '20px',
  MD: '30px',
  LG: '40px',
  XL: '60px',
  XXL: '100px'
};

export const MAX_CONTENT_WIDTH = '1200px';
export const MIN_CONTENT_PADDING = '15px';
