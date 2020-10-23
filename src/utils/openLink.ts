import { TURL } from '@types';

/**
 * @Security utility function for all 'window.open' calls
 * so we are sure that 'noreferrer' is set for each call.
 */

export const openLink = (url: TURL, target = '_blank') => {
  window.open(url, target, 'noreferrer');
};
