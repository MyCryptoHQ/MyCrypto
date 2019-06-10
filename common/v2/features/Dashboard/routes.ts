import Dashboard from './Dashboard';
import { RequestAssets } from './RequestAssets';

export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    exact: true,
    component: Dashboard
  },
  {
    name: 'Request Assets',
    path: '/dashboard/request',
    exact: true,
    component: RequestAssets
  }
];
