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

const { link, linkHover, ...lightTheme } = light;
const COLORS = {
  WARNING: '#ef4747',

  BLUE_BRIGHT: '#1eb8e7',
  BLUE_LIGHT: '#007896',
  BRAND_PRIMARY: '#007896',
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
};
// Combine the themes in a single object to be consummed by SC ThemeProvider
const theme = Object.assign({}, lightTheme, {
  breakpoints,
  colors: {
    ...COLORS,
    tableHeadBackground: COLORS.BLUE_GREY_LIGHTEST,
    linkAction: COLORS.BLUE_SKY,
    discrete: COLORS.BLUE_GREY,
    warning: COLORS.ERROR_RED
  },
  fontSizes: ['12px', '16px', '18px', '24px', '40px', '10px'],
  lineHeights: ['16px', '24px', '30px', '32px', '48px'],
  shadows: {
    desktop: '0px 3px 6px rgba(0, 0, 0, 0.07);',
    mobile: '0px -3px 10px rgba(133, 133, 133, 0.14);'
  },
  borders: {
    navItem: '3px solid'
  },
  radii: {
    default: '3px'
  }
});

const TEXT_VARIANTS = {
  heading: {
    fontSize: { _: 3, sm: 4 },
    lineHeight: { _: 2, sm: 4 },
    fontWeight: { _: 900, sm: 'bold' },
    color: 'BLUE_DARK_SLATE'
  },
  subHeading: {
    fontSize: 2,
    lineHeight: { _: 2, sm: 3 },
    color: 'GREYISH_BROWN',
    fontWeight: 'bold'
  },
  body: {
    fontSize: 1,
    lineHeight: 1,
    color: { _: 'BLUE_DARK_SLATE', sm: 'GREYISH_BROWN' }
  },
  tableHeading: {
    textTransform: 'uppercase',
    fontSize: 0,
    color: 'GREY_DARK',
    letterSpacing: '0.1em',
    fontWeight: '900'
  },
  navItem: {
    fontWeight: 700,
    margin: 0,
    marginTop: '5px',
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  discrete: {
    color: 'BLUE_GREY'
  },
  label: {
    marginBottom: '0.5em'
  }
};

export type TextVariants = keyof typeof TEXT_VARIANTS;

export const textVariants = variant({
  variants: TEXT_VARIANTS
});

const FLEX_RECIPES = {
  align: {
    display: 'flex',
    alignItems: 'center'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  end: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  start: {
    display: 'flex',
    justifyContent: 'flex-start'
  }
};

const FLEX_VARIANTS = {
  rowAlign: {
    flexDirection: 'row',
    ...FLEX_RECIPES.align
  },
  rowCenter: {
    flexDirection: 'row',
    ...FLEX_RECIPES.center
  },
  columnAlign: {
    flexDirection: 'column',
    ...FLEX_RECIPES.align
  },
  columnCenter: {
    flexDirection: 'column',
    ...FLEX_RECIPES.center
  },
  spaceBetween: {
    ...FLEX_RECIPES.spaceBetween
  },
  alignRight: {
    ...FLEX_RECIPES.end
  },
  columnAlignLeft: {
    flexDirection: 'column',
    ...FLEX_RECIPES.start
  },
  columnAlignRight: {
    flexDirection: 'column',
    ...FLEX_RECIPES.end
  }
};

export type FlexVariants = keyof typeof FLEX_VARIANTS;
export const flexVariants = variant({
  variants: FLEX_VARIANTS
});

export default theme;
