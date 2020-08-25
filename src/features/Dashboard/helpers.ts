import { Asset } from '@types';

import { Action } from './types';

export const filterDashboardActions = (actions: Action[], assets: Asset[]) =>
  actions.filter((action) => {
    const assetFilter = action.assetFilter;
    if (!assetFilter) return true;
    return assets.filter(assetFilter).length > 0;
  });
