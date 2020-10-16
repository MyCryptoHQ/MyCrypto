import mockStats from '@blockstack/stats';

import AnalyticsService from './Analytics';

jest.mock('@blockstack/stats');

describe('AnalyticsService', () => {
  it('track() params are formatted to match api', async () => {
    const params = {
      category: 'SignUp',
      eventAction: 'Account Added',
      eventParams: { accounts: 3 }
    };
    AnalyticsService.track(params);
    expect(mockStats.event).toHaveBeenCalledWith({
      name: params.eventAction,
      category: params.category,
      ...params.eventParams
    });
  });

  it('page() contains a name and a title', async () => {
    const params = { name: 'Send', url: '/send' };
    AnalyticsService.trackPageVisit(params);
    expect(mockStats.page).toHaveBeenCalledWith(params);
  });
});
