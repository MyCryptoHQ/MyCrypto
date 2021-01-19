import { event, getConfig, page, Providers, setConfig } from '@blockstack/stats';

import { ANALYTICS_API_URL, SEGMENT_WRITE_KEY } from '@utils';

import { TAnalyticEvents } from './constants';

export interface PageParams {
  name: string;
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
        writeKey: SEGMENT_WRITE_KEY!
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

const trackPage = ({ name, title }: PageParams) => {
  // @blockstack/stats/client already includes domain and path
  // while omitting query values.
  return page({ name, title });
};

export default {
  track,
  trackPage,
  initAnalytics,
  clearAnonymousID,
  setAnonymousID
};
