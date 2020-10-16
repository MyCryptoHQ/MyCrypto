import { getRouteConfigByPath } from './routePaths';

describe('getRouteConfigByPath()', () => {
  it('can find a route config object by pathname', () => {
    expect(getRouteConfigByPath('/dashboard')).toEqual({
      name: 'DASHBOARD',
      path: '/dashboard',
      title: 'Dashboard'
    });
  });
});
