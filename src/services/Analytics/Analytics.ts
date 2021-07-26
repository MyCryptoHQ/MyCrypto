import MatomoTracker from '@datapunt/matomo-tracker-js';

//import { ANALYTICS_API_URL, SEGMENT_WRITE_KEY } from '@utils';

import { TAnalyticEvents } from './constants';

export interface PageParams {
  name: string;
  title: string;
}

export interface TrackParams {
  name: TAnalyticEvents;
  params?: TObject;
}

const tracker = new MatomoTracker({
  urlBase: 'https://analytics.mycryptoapi.com',
  siteId: 11,
  //userId: 'UID76903202', // optional, default value: `undefined`.
  disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
  heartBeat: {
    // optional, enabled by default
    active: false, // optional, default value: true
    seconds: 10 // optional, default value: `15
  },
  linkTracking: false, // optional, default value: true
  configurations: {
    // optional, default value: {}
    // any valid matomo configuration, all below are optional
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

const track = ({ name, params }: TrackParams) => {
  return tracker.trackEvent({ category: 'app', action: name, ...params });
};

const trackPage = ({ name, title }: PageParams) => {
  // @blockstack/stats/client already includes domain and path
  // while omitting query values.
  //return page({ name, title });
  return tracker.trackPageView({ documentTitle: title, href: name });
};

export default {
  track,
  trackPage,
  initAnalytics,
  clearAnonymousID,
  setAnonymousID
};
