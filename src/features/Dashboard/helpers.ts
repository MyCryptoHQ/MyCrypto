import { Action } from './types';

export const filterDashboardActions = (actions: Action[], isMobile: boolean) =>
  actions.filter((action) => {
    const filter = action.filter;
    if (!filter) return true;
    return filter(isMobile);
  });
