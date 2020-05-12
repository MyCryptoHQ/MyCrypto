export const breakpointToNumber = (str: string): number =>
  parseInt(str.substring(0, str.indexOf('px')), 10);
