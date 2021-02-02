import { History } from 'history';

import { ROUTE_PATHS } from '@config';

export const goBack = (history: History<unknown>) =>
  history.location.key ? history.goBack() : history.push(ROUTE_PATHS.DASHBOARD.path);
