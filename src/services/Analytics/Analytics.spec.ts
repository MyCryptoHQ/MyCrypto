import mockStats from '@blockstack/stats';

import AnalyticsService, { TrackParams } from './Analytics';

jest.mock('@blockstack/stats');

describe('AnalyticsService', () => {
  it('track() params are formatted to match api', async () => {
    const data: TrackParams = {
      name: 'Add Account',
      params: { accounts: 3 }
    };
    AnalyticsService.track(data);
    expect(mockStats.event).toHaveBeenCalledWith({
      name: data.name,
      ...data.params
    });
  });

  it('page() contains a name and a title', async () => {
    const data = { name: 'Send', title: 'Send any crypto' };
    AnalyticsService.trackPage(data);
    expect(mockStats.page).toHaveBeenCalledWith(data);
  });
});
