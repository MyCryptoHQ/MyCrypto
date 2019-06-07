import Dashboard from './Dashboard';
import { RequestAssets } from './RequestAssets';
import { SendAssets } from './SendAssets';

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
  },
  {
    name: 'Send Assets',
    path: '/dashboard/send',
    exact: true,
    component: SendAssets
  }
];
