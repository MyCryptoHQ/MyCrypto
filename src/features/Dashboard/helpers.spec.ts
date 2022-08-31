import { actions } from './constants';
import { filterDashboardActions } from './helpers';

describe('filterDashboardActions', () => {
  it('test that filtering doesnt remove valid actions', () => {
    const filter = (isMobile: boolean) => isMobile;
    const action = { ...actions[0], filter };
    const result = filterDashboardActions([action], true);
    expect(result).toStrictEqual([action]);
  });

  it('test that filtering does remove invalid actions', () => {
    const filter = (isMobile: boolean) => !isMobile;
    const action = { ...actions[0], filter };
    const result = filterDashboardActions([action], true);
    expect(result).toStrictEqual([]);
  });
});
