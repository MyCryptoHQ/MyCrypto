import { WalletId, SigningComponents } from '@types';

import { default as SignTransactionKeystore } from './Keystore';
import { default as SignTransactionLedger } from './Ledger';
import { default as SignTransactionWeb3 } from './Web3';
import { default as SignTransactionMnemonic } from './Mnemonic';
import { default as SignTransactionPrivateKey } from './PrivateKey';
import { default as SignTransactionTrezor } from './Trezor';
import { default as SignTransactionWalletConnect } from './WalletConnect';

export const WALLET_STEPS: SigningComponents = {
  [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
  [WalletId.WEB3]: SignTransactionWeb3,
  [WalletId.METAMASK]: SignTransactionWeb3,
  [WalletId.TRUST]: SignTransactionWeb3,
  [WalletId.FRAME]: SignTransactionWeb3,
  [WalletId.COINBASE]: SignTransactionWeb3,
  [WalletId.LEDGER_NANO_S]: SignTransactionLedger,
  [WalletId.TREZOR]: SignTransactionTrezor,
  [WalletId.KEYSTORE_FILE]: SignTransactionKeystore,
  [WalletId.MNEMONIC_PHRASE]: SignTransactionMnemonic,
  [WalletId.WALLETCONNECT]: SignTransactionWalletConnect,
  [WalletId.VIEW_ONLY]: null
};
export { default as HardwareSignTransaction } from './Hardware';
