import React from 'react';
import { Aux } from 'components/ui';
import { GasField } from './GasField';
import { AmountField } from './AmountField';
import { NonceField } from 'components/NonceField';
import { OfflineAwareUnlockHeader } from 'components/OfflineAwareUnlockHeader';

export const Fields: React.SFC<{}> = () => (
  <Aux>
    <OfflineAwareUnlockHeader />
    <GasField />
    <AmountField />
    <NonceField />
  </Aux>
);
