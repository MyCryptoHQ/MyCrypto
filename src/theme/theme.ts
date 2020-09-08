import { light } from '@mycrypto/ui';
import { variant } from 'styled-system';

const breakpoints: string[] & {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  xxl?: string;
} = ['512px', '850px', '1080px', '1280px', '1440px', '1600px'];
breakpoints.xs = breakpoints[0];
breakpoints.sm = breakpoints[1];
breakpoints.md = breakpoints[2];
breakpoints.lg = breakpoints[3];
breakpoints.xl = breakpoints[4];
breakpoints.xxl = breakpoints[5];

// Combine the themes in a single object to be consummed by SC ThemeProvider
const theme = Object.assign({}, light, {
  breakpoints,
  colors: {
    BLUE_BRIGHT: '#1eb8e7',
    BLUE_LIGHT: '#007896',
    BLUE_LIGHTEST: '#E4EDFD',
    BLUE_SKY: '#55b6e2',
    BLUE_LIGHT_DARKISH: '#006077',
    BLUE_GREY: '#b5bfc7',
    BLUE_GREY_LIGHTEST: '#fafcfc',
    BLUE_DARK_SLATE: '#163150',
    BLUE_DARK: '#1c314e',
    BLUE_MYC: '#007A99',

    LEMON_GRASS: '#99968c',
    LIGHT_GREEN: '#B3DD87',
    SUCCESS_GREEN: '#5dba5a',
    SUCCESS_GREEN_LIGHT: '#b3dd87',
    WARNING_ORANGE: '#fa873f',
    ERROR_RED: '#ff5050',
    PASTEL_RED: '#ef4747',
    ERROR_RED_LIGHT: '#dd544e',
    GOLD: '#ffd166',

    WHITE: '#fff',
    GREY_LIGHTEST: '#f7f7f7',
    GREY_LIGHTER: '#e5ecf3',
    GREY_LIGHT: '#d8d8d8',
    GREY: '#b7bfc6',
    GREY_DARK: '#7b8695',
    GREY_DARKER: '#7b8695',
    GREY_DARKEST: '#282d32',
    BLACK: '#000',

    GREY_GEYSER: '#d6dce5',
    GREY_ATHENS: '#e8eaed',
    GREYISH_BROWN: '#424242',

    LIGHT_PURPLE: '#A682FF',
    PURPLE: '#a086f7',
    ORANGE: '#fa863f',
    GREEN: '#28a745',
    RED: '#FF0000',

    BG_GRAY: '#f6f8fa'
  },
  fontSizes: ['12px', '14px', '16px', '18px', '20px', '24px', '34px'],
  lineHeights: ['12px', '14px', '16px', '18px', '20px', '24px', '36px']
});

const variants = {
  heading: {
    fontSize: 6,
    color: 'BLUE_DARK_SLATE',
    fontWeight: 'bold'
  }
};

export type TextVariants = keyof typeof variants;

export const textVariants = variant({
  variants
});

export default theme;
