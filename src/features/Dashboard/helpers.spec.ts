import { fAssets } from '@fixtures';
import { State as StoreContextState } from '@services/Store/StoreProvider';

import { actions } from './constants';
import { filterDashboardActions } from './helpers';

describe('filterDashboardActions', () => {
  it('test that filtering doesnt remove valid actions', () => {
    const fakeContextState = { assets: () => fAssets };
    const filter = (state: StoreContextState) =>
      state.assets().some((a) => a.uuid === fAssets[0].uuid);
    const action = { ...actions[0], filter };
    const result = filterDashboardActions([action], fakeContextState as StoreContextState);
    expect(result).toStrictEqual([action]);
  });

  it('test that filtering does remove invalid actions', () => {
    const fakeContextState = { assets: () => [fAssets[1]] };
    const filter = (state: StoreContextState) =>
      state.assets().some((a) => a.uuid === fAssets[0].uuid);
    const action = { ...actions[0], filter };
    const result = filterDashboardActions([action], fakeContextState as StoreContextState);
    expect(result).toStrictEqual([]);
  });
});
