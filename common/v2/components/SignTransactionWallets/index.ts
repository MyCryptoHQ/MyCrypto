import { WalletId, SigningComponents } from 'v2/types';

import { default as SignTransactionKeystore } from './Keystore';
import { default as SignTransactionLedger } from './Ledger';
import { default as SignTransactionWeb3 } from './Web3';
import { default as SignTransactionMnemonic } from './Mnemonic';
import { default as SignTransactionParity } from './Parity';
import { default as SignTransactionPrivateKey } from './PrivateKey';
import { default as SignTransactionSafeT } from './SafeTmini';
import { default as SignTransactionTrezor } from './Trezor';

export const WALLET_STEPS: SigningComponents = {
  [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
  [WalletId.WEB3]: SignTransactionWeb3,
  [WalletId.METAMASK]: SignTransactionWeb3,
  [WalletId.TRUST]: SignTransactionWeb3,
  [WalletId.FRAME]: SignTransactionWeb3,
  [WalletId.COINBASE]: SignTransactionWeb3,
  [WalletId.LEDGER_NANO_S]: SignTransactionLedger,
  [WalletId.TREZOR]: SignTransactionTrezor,
  [WalletId.SAFE_T_MINI]: SignTransactionSafeT,
  [WalletId.KEYSTORE_FILE]: SignTransactionKeystore,
  [WalletId.PARITY_SIGNER]: SignTransactionParity,
  [WalletId.MNEMONIC_PHRASE]: SignTransactionMnemonic,
  [WalletId.VIEW_ONLY]: null
};
