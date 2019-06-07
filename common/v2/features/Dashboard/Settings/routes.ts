import Settings from './Settings';
import { Export } from './Export';
import { Import } from './Import';

export default [
  {
    name: 'Settings',
    path: '/settings',
    exact: true,
    component: Settings
  },
  {
    name: 'Import',
    path: '/settings/import',
    exact: true,
    component: Import
  },
  {
    name: 'Export',
    path: '/settings/export',
    exact: true,
    component: Export
  }
];
