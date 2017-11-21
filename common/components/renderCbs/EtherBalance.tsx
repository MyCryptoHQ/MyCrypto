import React from 'react';
import { AppState } from 'reducers';
import { Wallet } from './Wallet';

type IBalance = AppState['wallet']['balance'];

interface Props {
  withBalance({
    balance
  }: {
    balance: IBalance;
  }): React.ReactElement<any> | null;
}

export const EtherBalance: React.SFC<Props> = ({ withBalance }) => (
  <Wallet
    withWallet={({ wallet }) => withBalance({ balance: wallet.balance })}
  />
);
