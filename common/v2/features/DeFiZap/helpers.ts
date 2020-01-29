import {
  SignTransactionPrivateKey,
  SignTransactionWeb3,
  SignTransactionLedger,
  SignTransactionTrezor,
  SignTransactionSafeT,
  SignTransactionKeystore,
  SignTransactionParity,
  SignTransactionMnemonic
} from 'v2/components';
import { WalletId, SigningComponents, IHexStrTransaction, ITxObject } from 'v2/types';
import { inputValueToHex, inputGasPriceToHex, inputNonceToHex } from 'v2/services/EthService';
import { DEFAULT_NETWORK_CHAINID } from 'v2/config';
import { ISimpleTxForm } from './types';

export const createSimpleTxObject = (formData: ISimpleTxForm): IHexStrTransaction | ITxObject => {
  return {
    to: formData.address,
    value: inputValueToHex(formData.amount),
    data: '0x0',
    gasLimit: formData.gasLimit,
    gasPrice: inputGasPriceToHex(formData.gasPrice),
    nonce: inputNonceToHex(formData.nonce),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};

export const WALLET_STEPS: SigningComponents = {
  [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
  [WalletId.WEB3]: SignTransactionWeb3,
  [WalletId.METAMASK]: SignTransactionWeb3,
  [WalletId.TRUST]: SignTransactionWeb3,
  [WalletId.CIPHER]: SignTransactionWeb3,
  [WalletId.MIST]: SignTransactionWeb3,
  [WalletId.FRAME]: SignTransactionWeb3,
  [WalletId.LEDGER_NANO_S]: SignTransactionLedger,
  [WalletId.TREZOR]: SignTransactionTrezor,
  [WalletId.SAFE_T_MINI]: SignTransactionSafeT,
  [WalletId.KEYSTORE_FILE]: SignTransactionKeystore,
  [WalletId.PARITY_SIGNER]: SignTransactionParity,
  [WalletId.MNEMONIC_PHRASE]: SignTransactionMnemonic,
  [WalletId.VIEW_ONLY]: null
};
