import { event, page, Providers, setConfig } from '@blockstack/stats';

import { ANALYTICS_API_URL, ANALYTICS_WRITE_KEY, TAnalyticEvents } from './constants';

interface PageParams {
  name: string;
  pathname?: string;
  title: string;
}

export interface TrackParams {
  name: TAnalyticEvents;
  params?: TObject;
}

const initAnalytics = () => {
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

const trackPage = ({ name, title, pathname }: PageParams) => {
  //@todo: remove any query params from url.
  return page({ name, title, pathname });
};

export default {
  track,
  trackPage,
  initAnalytics
};
