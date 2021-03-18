import React from 'react';

import ScreenLockForgotPassword from './ScreenLockForgotPassword';
import ScreenLockLocked from './ScreenLockLocked';

export default { title: 'Features/ScreenLock', component: ScreenLockLocked };

const Wrapper = ({ children }: { children: any }) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    {children}
  </div>
);

export const Locked = () => (
  <Wrapper>
    <ScreenLockLocked />
  </Wrapper>
);

export const ForgotPassword = () => (
  <Wrapper>
    <ScreenLockForgotPassword />
  </Wrapper>
);
