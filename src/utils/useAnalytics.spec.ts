import nock from 'nock';
import { ANALYTICS_CATEGORIES } from '@services';
import { ANALYTICS_API_URL } from '@services/ApiService/Analytics/constants';
import { useAnalytics } from '@utils/index';
import { renderHook, act } from '@testing-library/react-hooks';

const categoryFixture = ANALYTICS_CATEGORIES.ROOT;
const actionNameFixture = 'Testing action name';
const appUrlFixture = '/sample/route';

describe('useAnalytics', () => {
  nock.back.setMode('record');
  let nockInstance: nock.Scope;

  beforeEach(() => {
    nockInstance = nock(ANALYTICS_API_URL.slice(0, -1))
      .persist()
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get(/.*/)
      .reply(200, {}); // responses are handled by nock.
  });

  afterEach(() => {
    // Check if analytics service mock has been hit
    nockInstance.done();

    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('Should track on mount', async () => {
    const { wait } = renderHook(() =>
      useAnalytics({
        category: categoryFixture,
        actionName: actionNameFixture,
        triggerOnMount: true
      })
    );

    // Wait one second to finish, since useAnalytics does not provide promise when triggerOnMount is set to true
    await act(async () => await wait(() => true, { timeout: 1000 }));
  });

  it('Should track on callback', async () => {
    const { result } = renderHook(() =>
      useAnalytics({
        category: categoryFixture,
        actionName: actionNameFixture
      })
    );

    await act(async () => await result.current());
  });

  it('Should track page view on mount', async () => {
    const { wait } = renderHook(() =>
      useAnalytics({
        trackPageViews: true,
        actionName: appUrlFixture,
        triggerOnMount: true
      })
    );

    await act(async () => await wait(() => true, { timeout: 1000 }));
  });

  it('Should track page view on callback', async () => {
    const { result } = renderHook(() =>
      useAnalytics({
        trackPageViews: true
      })
    );

    await act(
      async () =>
        await result.current({
          actionName: appUrlFixture
        })
    );
  });
});
