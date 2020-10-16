import { event, page, Providers, setConfig } from '@blockstack/stats';

import { ANALYTICS_API_URL, ANALYTICS_WRITE_KEY, TAnalyticEvents } from './constants';

interface PageParams {
  name: string;
  pathName: string;
  title?: string;
}

export interface TrackParams {
  name: TAnalyticEvents;
  params?: TObject;
}

/**
 * Configure the lib on build time.
 */
let isInitialized = false;
const initAnalytics = () => {
  if (isInitialized) {
    throw new Error('Analytics already initialized');
  }
  isInitialized = true;
  setConfig({
    host: ANALYTICS_API_URL,
    providers: [
      {
        name: Providers.Segment,
        writeKey: ANALYTICS_WRITE_KEY
      }
    ]
  });
};

const track = ({ name, params }: TrackParams) => {
  return event({ name, ...params });
};

const trackPage = ({ name, title, pathName }: PageParams) => {
  //@todo: remove any query params from url.
  return page({ name, title, pathName });
};

export default {
  track,
  trackPage,
  initAnalytics
};
