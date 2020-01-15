import AnalyticsService from './Analytics';

const testUrl: string = 'test_url';
const testPath: string = 'test_path';
const testNetwork: string = 'test_network';

describe('AnalyticsService', () => {
  it('should add page url param to page visit event', async () => {
    const {
      status,
      config: { params }
    } = await AnalyticsService.instance.trackPageVisit(testUrl, testPath, testNetwork);

    expect(status).toBe(200);
    expect(params.url).toBe(testUrl);
  });
});
