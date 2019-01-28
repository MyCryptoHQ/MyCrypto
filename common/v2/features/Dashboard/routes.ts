import Dashboard from './Dashboard';
import { SendAssets } from './SendAssets';

export default [
  {
    name: 'Dashboard',
    path: '/dashboard',
    exact: true,
    component: Dashboard
  },
  {
    name: 'Send Assets',
    path: '/dashboard/send',
    exact: true,
    component: SendAssets
  }
];
