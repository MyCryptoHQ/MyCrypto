import { WALLETS_CONFIG } from '@config';
import { WalletId } from '@types';
import { noOp } from '@utils';

import { Web3UnlockUI, Web3UnlockUIProps } from './Web3Provider';

export default { title: 'Features/AddAccount/Web3Unlock', components: Web3UnlockUI };

const initialProps: Web3UnlockUIProps = {
  isDefault: false,
  web3ProviderSettings: WALLETS_CONFIG[WalletId.METAMASK],
  web3Unlocked: true,
  web3UnlockError: undefined,
  isSubmitting: false,
  transProps: { $walletId: WALLETS_CONFIG[WalletId.METAMASK].name },
  unlockWallet: noOp
};

export const Web3Unlock = () => {
  return (
    <div className="sb-container" style={{ maxWidth: '620px' }}>
      <Web3UnlockUI {...initialProps} />
    </div>
  );
};
