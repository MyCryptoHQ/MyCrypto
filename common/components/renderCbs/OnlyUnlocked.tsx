import React from 'react';
import { Wallet } from './Wallet';
interface Props {
  whenUnlocked: React.ReactElement<any>;
}

export const OnlyUnlocked: React.SFC<Props> = ({ whenUnlocked }) => (
  <Wallet withWallet={({ wallet }) => (!!wallet.inst ? whenUnlocked : null)} />
);
