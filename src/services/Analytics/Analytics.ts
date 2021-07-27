import MatomoTracker from '@datapunt/matomo-tracker-js';

//import { ANALYTICS_API_URL, SEGMENT_WRITE_KEY } from '@utils';

import { TAnalyticEvents } from './constants';

export interface PageParams {
  name: string;
  title: string;
}

export interface TrackParams {
  action: TAnalyticEvents;
  name?: string;
  value?: number;
}

export interface LinkParams {
  url: string;
  type?: 'download' | 'link';
}

const tracker = new MatomoTracker({
  urlBase: 'https://analytics.mycryptoapi.com',
  siteId: 11,
  //userId: 'UID76903202', // optional, default value: `undefined`.
  disabled: false,
  heartBeat: {
    active: false
  },
  linkTracking: false,
  configurations: {
    disableCookies: true,
    setSecureCookie: true,
    setRequestMethod: 'POST'
  }
});

const initAnalytics = () => {
  /*setConfig({
    host: "http://localhost:5555",
    providers: [
      {
        name: Providers.Segment,
        writeKey: SEGMENT_WRITE_KEY!
      }
    ]
  });*/
};

/**
 * Blockstack/stats sets an anonymous id on `setConfig`.
 * If a user chooses to deactivate product analytics we ensure to clear
 * the LS value as well.
 */
const clearAnonymousID = () => {
  /*const LS_BSK_ID = '__bsk_ana_id__';
  localStorage.removeItem(LS_BSK_ID);*/
};

const setAnonymousID = () => {
  //return getConfig();
};

const track = ({ action, name, value }: TrackParams) => {
  return tracker.trackEvent({ category: 'app', action, name, value });
};

const trackPage = ({ name, title }: PageParams) => {
  // @blockstack/stats/client already includes domain and path
  // while omitting query values.
  //return page({ name, title });
  return tracker.trackPageView({ documentTitle: title, href: name });
};

const trackLink = ({ url, type }: LinkParams) => {
  return tracker.trackLink({ href: url, linkType: type });
};

export default {
  track,
  trackPage,
  trackLink,
  initAnalytics,
  clearAnonymousID,
  setAnonymousID
};
