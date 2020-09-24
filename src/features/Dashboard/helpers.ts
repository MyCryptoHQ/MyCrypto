import { State as StoreContextState } from '@services/Store/StoreProvider';

import { Action } from './types';

export const filterDashboardActions = (actions: Action[], state: StoreContextState) =>
  actions.filter((action) => {
    const filter = action.filter;
    if (!filter) return true;
    return filter(state);
  });
