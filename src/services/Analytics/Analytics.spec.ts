import AnalyticsService, { TrackParams } from './Analytics';

jest.mock('@datapunt/matomo-tracker-js');

describe('AnalyticsService', () => {
  it('track() params are formatted to match api', async () => {
    const data: TrackParams = {
      action: 'Add Account',
      value: 3
    };
    AnalyticsService.track(data);
    expect(AnalyticsService.tracker.trackEvent).toHaveBeenCalledWith({
      category: 'app',
      ...data
    });
  });

  it('track() ensures params may not override event name', async () => {
    const data: TrackParams = {
      action: 'Add Asset',
      name: 'ETH'
    };
    AnalyticsService.track(data);
    expect(AnalyticsService.tracker.trackEvent).toHaveBeenCalledWith({
      category: 'app',
      ...data
    });
  });

  it('page() contains a name and a title', async () => {
    const data = { name: 'Send', title: 'Send any crypto' };
    AnalyticsService.trackPage(data);
    expect(AnalyticsService.tracker.trackPageView).toHaveBeenCalledWith({
      documentTitle: data.title,
      href: data.name
    });
  });
});
