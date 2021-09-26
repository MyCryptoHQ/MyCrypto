import MatomoTracker from '@datapunt/matomo-tracker-js';

import { ANALYTICS_API } from '@config';

import { TAnalyticEvents } from './constants';
import { getSiteID } from './helpers';

interface CustomDimension {
  id: number;
  value: string;
}

export interface PageParams {
  name: string;
  title: string;
}

export interface TrackParams {
  action: TAnalyticEvents;
  name?: string;
  value?: number;
  customDimensions?: CustomDimension[];
}

export interface LinkParams {
  url: string;
  type?: 'download' | 'link';
}

const tracker = new MatomoTracker({
  urlBase: ANALYTICS_API,
  siteId: getSiteID(),
  disabled: false,
  srcUrl: 'matomo.js',
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

const track = ({ action, name, value, customDimensions }: TrackParams) =>
  tracker.trackEvent({ category: 'app', action, name, value, customDimensions });

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
