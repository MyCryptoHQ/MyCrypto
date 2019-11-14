import { sortBy, cloneDeep } from 'lodash';
import { StateMutabilityType, ABIItem, ABIItemType } from './types';
import { WalletId, SigningComponents, StoreAccount, NetworkId } from 'v2/types';
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

export const isReadOperation = (abiFunction: ABIItem) => {
  const { stateMutability } = abiFunction;

  if (stateMutability) {
    return (
      stateMutability === StateMutabilityType.PURE || stateMutability === StateMutabilityType.VIEW
    );
  } else {
    return !!abiFunction.constant;
  }
};

export const generateFunctionFieldsDisplayNames = (abiFunction: ABIItem) => {
  const tempFunction = cloneDeep(abiFunction);

  tempFunction.inputs.forEach((input, index) => {
    if (input.displayName) {
      return;
    }

    if (input.name === '') {
      input.name = index.toString();
      input.displayName = `Input#${index}`;
    } else {
      input.displayName = input.name;
    }
  });

  tempFunction.outputs.forEach((output, index) => {
    if (output.displayName) {
      return;
    }

    if (output.name === '') {
      output.name = index.toString();
      output.displayName = `Output#${index}`;
    } else {
      output.displayName = output.name;
    }
  });

  return tempFunction;
};

export const setFunctionOutputValues = (abiFunction: ABIItem, outputValues: any) => {
  const tempFunction = cloneDeep(abiFunction);

  tempFunction.outputs.forEach(output => {
    output.value = outputValues[output.name];
  });

  return tempFunction;
};

export const getFunctionsFromABI = (pAbi: ABIItem[]) =>
  sortBy(pAbi.filter(x => x.type === ABIItemType.FUNCTION), item => item.name.toLowerCase()).map(
    x => Object.assign(x, { label: x.name })
  );

export const WALLET_STEPS: SigningComponents = {
  [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
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

export const getAccountsInNetwork = (accounts: StoreAccount[], networkId: NetworkId) =>
  accounts.filter(acc => acc.networkId === networkId && WALLET_STEPS[acc.wallet]);
