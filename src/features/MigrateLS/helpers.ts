import { prop, path } from '@vendor';
import { TURL } from '@types';
import { getCurrentDBConfig } from '@database';

const getHostName: (obj: Window) => string | undefined = path(['location', 'hostname']);

export const DBName = prop('main', getCurrentDBConfig());

/**
 * Retrieve the url of the landing page according to current execution envirionment
 * @param hostname : TURL
 */
export const getIFrameSrc = (win: Window) => {
  const hostname = getHostName(win);
  switch (hostname) {
    case 'mycrypto.com':
      return 'https://beta.mycrypto.com' as TURL;
    case 'app.mycrypto.com':
      return 'https://beta.mycrypto.com' as TURL;
    case 'mycryptobuilds.com':
      return 'https://landing.mycryptobuilds.com' as TURL;
    case 'rc.app.mycrypto.com':
      return 'https://landing.mycryptobuilds.com' as TURL;
    case 'localhost':
      return 'https://localhost:8000' as TURL;
    default:
      return undefined;
  }
};

/**
 * Take an HTMLIFrameElement and check if the localstorage has the correct key
 */
export const getLS = (obj: HTMLIFrameElement): string | undefined => {
  try {
    return path(['contentWindow', 'localStorage', DBName])(obj) as string | undefined;
  } catch (err) {
    console.debug('[getLS]: ', err);
  }
};

export const getOrigin = (obj: any): string | undefined => {
  try {
    return path(['contentWindow', 'location', 'origin'])(obj) as string | undefined;
  } catch (err) {
    console.debug('[getOrigin]: ', err);
  }
};