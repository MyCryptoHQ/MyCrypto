import { ComponentProps } from 'react';

import { DEFAULT_NETWORK } from '@config';
import { fAccounts, fApproveErc20TxConfig } from '@fixtures';
import { translateRaw } from '@translations';
import { BusyBottomConfig, WalletId } from '@types';

import { SignTxHardwareUI, WalletSigningState } from './Hardware';

export default { title: 'Features/SignTransaction/Hardware', component: SignTxHardwareUI };

const initialProps: ComponentProps<typeof SignTxHardwareUI> = {
  walletIconType: 'ledger-icon-lg',
  signerDescription: translateRaw('SIGN_TX_LEDGER_DESCRIPTION', {
    $network: DEFAULT_NETWORK
  }),
  wallet: BusyBottomConfig.LEDGER,
  senderAccount: { ...fAccounts[0], wallet: WalletId.LEDGER_NANO_S_NEW },
  signingState: WalletSigningState.REJECTED,
  rawTransaction: fApproveErc20TxConfig.rawTransaction,
  contractName: '0x Proxy'
};

export const HardwareWalletUI = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '800px' }}>
      <SignTxHardwareUI {...initialProps} />
    </div>
  );
};
