import { WALLETS_CONFIG } from '@config';
import { fAccounts, fApproveErc20TxConfig } from '@fixtures';
import { WalletId } from '@types';

import { SignTransactionWeb3UI, UIProps, WalletSigningState } from './Web3';

export default { title: 'Features/SignTransaction/Web3', components: SignTransactionWeb3UI };

const initialProps: UIProps = {
  walletConfig: WALLETS_CONFIG[WalletId.METAMASK],
  walletState: WalletSigningState.SUBMITTING,
  networkName: 'Ethereum',
  senderAccount: { ...fAccounts[0], wallet: WalletId.METAMASK },
  rawTransaction: fApproveErc20TxConfig.rawTransaction,
  contractName: '0x Proxy'
};

export const SignTransactionWeb3 = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '650px' }}>
      <SignTransactionWeb3UI {...initialProps} />
    </div>
  );
};
