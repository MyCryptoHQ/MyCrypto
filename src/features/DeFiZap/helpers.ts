import { COLORS } from '@theme';

export const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'uniswap':
      return COLORS.PURPLE;
    case 'fulcrum':
      return COLORS.BLUE_GREY;
    case 'kyber':
      return COLORS.ORANGE;
    case 'synthetix':
      return COLORS.BLUE_BRIGHT;
    case 'compound':
      return COLORS.LIGHT_GREEN;
    case 'mkr':
      return COLORS.BLACK;
    default:
      return COLORS.LEMON_GRASS;
  }
};
