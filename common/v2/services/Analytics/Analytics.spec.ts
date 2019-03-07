import AnalyticsService from './Analytics';

const category: string = 'Test';
const eventName: string = 'Test event';
const testUrl: string = 'test_url';

describe('AnalyticsService', () => {
  it('should send event to analytics endpoint', async () => {
    const { status, config: { params } } = await AnalyticsService.instance.track(
      category,
      eventName
    );

    expect(status).toBe(200);
    expect(params.e_c).toBe(category);
    expect(params.action_name).toBe(eventName);
  });

  it('should add Legacy_ prefix to legacy event', async () => {
    const { status, config: { params } } = await AnalyticsService.instance.trackLegacy(
      category,
      eventName
    );

    expect(status).toBe(200);
    expect(params.e_c).toBe(category);
    expect(params.action_name).toBe(`Legacy_${eventName}`);
  });

  it('should add page url param to page visit event', async () => {
    const { status, config: { params } } = await AnalyticsService.instance.trackPageVisit(testUrl);

    expect(status).toBe(200);
    expect(params.url).toBe(testUrl);
  });
});
