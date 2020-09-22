import { getCurrentDBConfig } from '@database';
import { TURL } from '@types';
import { path, prop } from '@vendor';

const getDomain: (obj: Document) => string | undefined = prop('domain');
export const DBName = prop('main', getCurrentDBConfig());

/**
 * Retrieve the url of the landing page according to current execution envirionment
 * Relies on setting document.domain in src/index.tsx
 * @param hostname : TURL
 */
export const getIFrameSrc = (doc: Document) => {
  const domain = getDomain(doc);
  switch (domain) {
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
