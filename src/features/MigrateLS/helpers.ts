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
    case 'mycryptobuilds.com':
      return 'https://landing.mycryptobuilds.com' as TURL;
    default:
      return 'https://localhost:8000' as TURL;
  }
};

/**
 * Take an HTMLIFrameElement and check if the localstorage has the correct key
 */
export const getLS: (obj: HTMLIFrameElement) => string | undefined = path([
  'contentWindow',
  'localStorage',
  DBName
]);

export const getOrigin: (obj: any) => string | undefined = path([
  'contentWindow',
  'location',
  'origin'
]);
