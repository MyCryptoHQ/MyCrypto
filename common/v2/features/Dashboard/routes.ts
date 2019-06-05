import Dashboard from './Dashboard';
import { RequestAssets } from './RequestAssets';
import { SendAssets } from './SendAssets';
import { Settings } from './Settings';

export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    exact: true,
    component: Dashboard
  },
  {
    name: 'Request Assets',
    path: '/requestAssets',
    exact: true,
    component: RequestAssets
  },
  {
    name: 'Send Assets',
    path: '/sendAssets',
    exact: true,
    component: SendAssets
  },
  {
    name: 'Settings',
    path: '/settings',
    exact: true,
    component: Settings
  }
];
