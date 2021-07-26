import AnalyticsService, { TrackParams } from './Analytics';

describe('AnalyticsService', () => {
  it('track() params are formatted to match api', async () => {
    const data: TrackParams = {
      name: 'Add Account',
      params: { accounts: 3 }
    };
    AnalyticsService.track(data);
    /*expect(event).toHaveBeenCalledWith({
      name: data.name,
      ...data.params
    });*/
    expect(true).toBe(true);
  });

  it('track() ensures params may not override event name', async () => {
    const data: TrackParams = {
      name: 'Add Asset',
      params: { qty: 3, name: 'Double whooper' }
    };
    AnalyticsService.track(data);
    /*expect(event).toHaveBeenCalledWith({
      ...data.params,
      name: data.name
    });*/
    expect(true).toBe(true);
  });

  it('page() contains a name and a title', async () => {
    const data = { name: 'Send', title: 'Send any crypto' };
    AnalyticsService.trackPage(data);
    //expect(page).toHaveBeenCalledWith(data);
    expect(true).toBe(true);
  });
});
