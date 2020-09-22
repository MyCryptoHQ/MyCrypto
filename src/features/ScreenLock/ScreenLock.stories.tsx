import React from 'react';

import ScreenLockForgotPassword from './ScreenLockForgotPassword';
import ScreenLockLocked from './ScreenLockLocked';
import ScreenLockNew from './ScreenLockNew';

export default { title: 'ScreenLock' };

const Wrapper = ({ children }: { children: any }) => (
  <div className="sb-container" style={{ maxWidth: '620px' }}>
    {children}
  </div>
);

export const NewPassword = () => (
  <Wrapper>
    <ScreenLockNew />
  </Wrapper>
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
