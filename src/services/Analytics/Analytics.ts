import MatomoTracker from '@datapunt/matomo-tracker-js';

import { ANALYTICS_API } from '@config';

import { TAnalyticEvents } from './constants';

export interface PageParams {
  name: string;
  title: string;
}

export interface TrackParams {
  action: TAnalyticEvents;
  name?: string;
  value?: number;
  customDimensions?: any;
}

export interface LinkParams {
  url: string;
  type?: 'download' | 'link';
}

const LS_ANA_UID_NAME = 'MYC_ANA_UID';

const makeID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getOrSetAnonymousID = () => {
  const existingID = localStorage.getItem(LS_ANA_UID_NAME);
  if (existingID) {
    return existingID;
  }
  const newID = makeID();
  localStorage.setItem(LS_ANA_UID_NAME, newID);
  return newID;
};

const tracker = new MatomoTracker({
  urlBase: ANALYTICS_API,
  siteId: 11,
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
  tracker.pushInstruction('setUserId', getOrSetAnonymousID());
};

/**
 * If a user chooses to deactivate product analytics we ensure to clear
 * the LS value as well.
 */
const clearAnonymousID = () => {
  localStorage.removeItem(LS_ANA_UID_NAME);
};

const setAnonymousID = () => {
  tracker.pushInstruction('setUserId', getOrSetAnonymousID());
};

const track = ({ action, name, value }: TrackParams) => {
  return tracker.trackEvent({ category: 'app', action, name, value });
};

const trackPage = ({ name, title }: PageParams) => {
  return tracker.trackPageView({ documentTitle: title, href: name });
};

const trackLink = ({ url, type }: LinkParams) => {
  return tracker.trackLink({ href: url, linkType: type });
};

export default {
  tracker,
  track,
  trackPage,
  trackLink,
  initAnalytics,
  clearAnonymousID,
  setAnonymousID
};
