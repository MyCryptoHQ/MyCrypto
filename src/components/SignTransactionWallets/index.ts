import { SigningComponents, WalletId } from '@types';

import { default as SignTransactionKeystore } from './Keystore';
import { default as SignTransactionLedger } from './Ledger';
import { default as SignTransactionMnemonic } from './Mnemonic';
import { default as SignTransactionPrivateKey } from './PrivateKey';
import { default as SignTransactionTrezor } from './Trezor';
import { default as SignTransactionWalletConnect } from './WalletConnect';
import { default as SignTransactionWeb3 } from './Web3';

export const WALLET_STEPS: SigningComponents = {
  [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
  [WalletId.WEB3]: SignTransactionWeb3,
  [WalletId.METAMASK]: SignTransactionWeb3,
  [WalletId.TRUST]: SignTransactionWeb3,
  [WalletId.FRAME]: SignTransactionWeb3,
  [WalletId.COINBASE]: SignTransactionWeb3,
  [WalletId.LEDGER_NANO_S]: SignTransactionLedger,
  [WalletId.LEDGER_NANO_S_NEW]: SignTransactionLedger,
  [WalletId.TREZOR]: SignTransactionTrezor,
  [WalletId.TREZOR_NEW]: SignTransactionTrezor,
  [WalletId.KEYSTORE_FILE]: SignTransactionKeystore,
  [WalletId.MNEMONIC_PHRASE]: SignTransactionMnemonic,
  [WalletId.MNEMONIC_PHRASE_NEW]: SignTransactionMnemonic,
  [WalletId.WALLETCONNECT]: SignTransactionWalletConnect,
  [WalletId.VIEW_ONLY]: null
};
export { default as HardwareSignTransaction } from './Hardware';
