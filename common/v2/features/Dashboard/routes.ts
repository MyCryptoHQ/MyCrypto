import Dashboard from './Dashboard';
import { RequestAssets } from './RequestAssets';
import { SendAssets } from './SendAssets';
// import { Settings } from './Settings';
import { Import } from './Settings/Import';
import { Export } from './Settings/Export';

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
  },
  {
    name: 'Import',
    path: '/dashboard/settings/import',
    exact: true,
    component: Import
  },
  {
    name: 'Export',
    path: '/dashboard/settings/export',
    exact: true,
    component: Export
  }
];
