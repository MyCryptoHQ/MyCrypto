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

export const makeID = () =>
  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const tracker = new MatomoTracker({
  urlBase: ANALYTICS_API,
  siteId: 11, // Testing: 11, Production: 17
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

const setAnonymousID = (analyticsUserID: string) => {
  tracker.pushInstruction('setUserId', analyticsUserID);
};

const track = ({ action, name, value }: TrackParams) =>
  tracker.trackEvent({ category: 'app', action, name, value });

const trackPage = ({ name, title }: PageParams) =>
  tracker.trackPageView({ documentTitle: title, href: name });

const trackLink = ({ url, type }: LinkParams) => tracker.trackLink({ href: url, linkType: type });

export default {
  tracker,
  track,
  trackPage,
  trackLink,
  setAnonymousID
};
