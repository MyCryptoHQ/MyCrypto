import { event, getConfig, page, Providers, setConfig } from '@blockstack/stats';

import { ANALYTICS_API_URL, ANALYTICS_WRITE_KEY, TAnalyticEvents } from './constants';

export interface PageParams {
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

/**
 * Blockstack/stats sets an anonymous id on `setConfig`.
 * If a user chooses to deactivate product analytics we ensure to clear
 * the LS value as well.
 */
const clearAnonymousID = () => {
  const LS_BSK_ID = '__bsk_ana_id__';
  localStorage.removeItem(LS_BSK_ID);
};

const setAnonymousID = () => getConfig();

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
  initAnalytics,
  clearAnonymousID,
  setAnonymousID
};
