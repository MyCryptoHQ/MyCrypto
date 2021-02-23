import React from 'react';

import { WALLETS_CONFIG } from '@config';
import { fAccounts } from '@fixtures';
import { WalletId } from '@types';

import { SignTransactionWeb3UI, UIProps, WalletSigningState } from './Web3';

export default { title: 'Features/SignTransaction/Web3', components: SignTransactionWeb3UI };

const initialProps: UIProps = {
  walletConfig: WALLETS_CONFIG[WalletId.METAMASK],
  walletState: WalletSigningState.SUBMITTING,
  networkName: 'Ethereum',
  senderAccount: { ...fAccounts[0], wallet: WalletId.METAMASK }
};

export const SignTransactionWeb3 = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '650px' }}>
      <SignTransactionWeb3UI {...initialProps} />
    </div>
  );
};
