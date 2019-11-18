import nock from 'nock';
import AnalyticsService from './Analytics';
import { ANALYTICS_API_URL } from './constants';

let category: string;
let eventAction: string;
let appUrl: string;

describe('AnalyticsService', () => {
  nock.back.setMode('record');

  beforeEach(() => {
    category = 'Category';
    eventAction = 'Name of Event';
    appUrl = 'App route url';

    nock(ANALYTICS_API_URL)
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get(/.*/)
      .reply(200, {}); // responses are handled by nock.
  });

  it('should send an action name', async () => {
    const {
      status,
      config: { params }
    } = await AnalyticsService.instance.track(category, eventAction);

    expect(status).toBe(200);
    expect(params.e_c).toBe(category);
    expect(params.action_name).toBe(eventAction);
  });

  it('should add Legacy_ prefix to legacy event', async () => {
    const {
      status,
      config: { params }
    } = await AnalyticsService.instance.trackLegacy(category, eventAction);

    expect(status).toBe(200);
    expect(params.e_c).toBe(category);
    expect(params.action_name).toBe(`Legacy_${eventAction}`);
  });

  it('should add page url param to page visit event', async () => {
    const {
      status,
      config: { params }
    } = await AnalyticsService.instance.trackPageVisit(appUrl);

    expect(status).toBe(200);
    expect(params.url).toBe(appUrl);
  });

  nock.back.setMode('wild');
});
