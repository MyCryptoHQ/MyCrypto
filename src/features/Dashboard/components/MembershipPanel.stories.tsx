import React from 'react';

import { ProvidersWrapper } from 'test-utils';

import MembershipPanel from './MembershipPanel';

export default { title: 'Organisms/MembershipPanel', component: MembershipPanel };

export const defaultState = () => (
  <ProvidersWrapper>
    <MembershipPanel />
  </ProvidersWrapper>
);
