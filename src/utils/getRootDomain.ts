/**
 * Primitive util to extract root domain from a hostname.
 * Blindly returns the last 2 dot seperated strings.
 * Returns empty string if argument is undefined.
 * @param hostname
 */

export const getRootDomain = (hostname = '') => {
  return hostname.split('.').reverse().slice(0, 2).reverse().join('.');
};
