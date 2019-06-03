import AnalyticsService from './Analytics';

const testUrl: string = 'test_url';

describe('AnalyticsService', () => {
  it('should add page url param to page visit event', async () => {
    const { status, config: { params } } = await AnalyticsService.instance.trackPageVisit(testUrl);

    expect(status).toBe(200);
    expect(params.url).toBe(testUrl);
  });
});
