import { ScreenLockNew } from './ScreenLockNew';
import { ScreenLockLocked } from './ScreenLockLocked';
export default [
  {
    name: 'Screen Lock New',
    path: '/screen-lock/new',
    exact: true,
    component: ScreenLockNew
  },
  {
    name: 'Screen Lock Locked',
    path: '/screen-lock/locked',
    exact: true,
    component: ScreenLockLocked
  }
];
