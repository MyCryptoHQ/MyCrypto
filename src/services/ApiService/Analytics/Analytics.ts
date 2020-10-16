import { event, page, Providers, setConfig } from '@blockstack/stats';

import { ANALYTICS_API_URL, ANALYTICS_WRITE_KEY } from './constants';

/**
 * Configure the lib on build time.
 */
setConfig({
  host: ANALYTICS_API_URL,
  providers: [
    {
      name: Providers.Segment,
      writeKey: ANALYTICS_WRITE_KEY
    }
  ]
});

interface PageParams {
  name: string;
  title?: string;
  url: string;
}

interface TrackParams {
  category: string;
  eventAction: string;
  eventParams?: TObject;
}

function AnalyticsService() {
  const track = ({ category, eventAction, eventParams }: TrackParams) => {
    return event({ name: eventAction, category, ...eventParams });
  };

  const trackPageVisit = ({ name, title, url }: PageParams) => {
    //@todo: remove any query params from url.
    return page({ name, title, url });
  };

  return {
    track,
    trackPageVisit
  };
}

export default AnalyticsService();
