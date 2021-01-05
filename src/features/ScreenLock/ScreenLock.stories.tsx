import React from 'react';

import { ProvidersWrapper } from 'test-utils';

import ScreenLockForgotPassword from './ScreenLockForgotPassword';
import ScreenLockLocked from './ScreenLockLocked';
import ScreenLockNew from './ScreenLockNew';

export default { title: 'Features/ScreenLock', component: ScreenLockNew };

const Wrapper = ({ children }: { children: any }) => (
  <ProvidersWrapper>
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      {children}
    </div>
  </ProvidersWrapper>
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
