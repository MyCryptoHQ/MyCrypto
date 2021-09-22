import { ANALYTICS_SITE_ID_DEV, ANALYTICS_SITE_ID_PROD } from '@config';
import { IS_E2E, IS_PROD, IS_STAGING } from '@utils';

// Generates a pseudo-random 22-character base-36 string.
// https://gist.github.com/6174/6062387#gistcomment-3390777
export const makeID = () =>
  [...Array(22)].map(() => (~~(Math.random() * 36)).toString(36)).join('');

// Returns Matomo site ID to use.
// Switch to different ID on production environment to make sure analytics events caused by testing are being categorized as such.
export const getSiteID = () => {
  if (IS_PROD && !(IS_STAGING || IS_E2E)) {
    return ANALYTICS_SITE_ID_PROD;
  } else {
    return ANALYTICS_SITE_ID_DEV;
  }
};
