import { ScreenLockNew } from './ScreenLockNew';
import { ScreenLockLocked } from './ScreenLockLocked';
import { ScreenLockForgotPassword } from './ScreenLockForgotPassword';

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
  },
  {
    name: 'Screen Lock Forgot Password',
    path: '/screen-lock/forgot-password',
    exact: true,
    component: ScreenLockForgotPassword
  }
];
