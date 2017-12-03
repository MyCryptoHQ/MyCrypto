import React from 'react';
import { Wallet } from './Wallet';
import { Wei } from 'libs/units';

interface Props {
  withBalance({
    balance
  }: {
    balance: Wei | null;
  }): React.ReactElement<any> | null;
}

export const EtherBalance: React.SFC<Props> = ({ withBalance }) => (
  <Wallet
    withWallet={({ wallet }) => withBalance({ balance: wallet.balance.wei })}
  />
);
