import erc20 from 'libs/erc20';
import EthTx from 'ethereumjs-tx';
import { toChecksumAddress } from 'ethereumjs-util';

import { Token } from 'types/network';
import { AppState } from 'features/reducers';
import { getAddressMessage, AddressMessage } from 'config';
import { TokenValue, Wei, Address, getDecimalFromEtherUnit } from 'libs/units';
import { stripHexPrefixAndLower } from 'libs/values';
import { getTransactionFields, makeTransaction, IHexStrTransaction } from 'libs/transaction';
import { gasPriceValidator, gasLimitValidator } from 'libs/validators';
import { getNetworkConfig, isNetworkUnit, getOffline } from 'features/config';
import { getEtherBalance, getToken, getWalletType } from 'features/wallet';
import { getCustomTokens } from 'features/customTokens';
import { getTo, getValue, getGasPrice, getGasLimit, getData, getFields } from './fields/selectors';
import { getTransactionStatus } from './broadcast/selectors';
import {
  getTokenTo,
  getTokenValue,
  getMetaState,
  isContractInteraction,
  getDecimal
} from './meta/selectors';
import { getSignState, getSignedTx, getWeb3Tx } from './sign/selectors';
import { SerializedTxParams } from './sign/types';
import { reduceToValues, isFullTx } from './helpers';

export interface ICurrentValue {
  raw: string;
  value: TokenValue | Wei | null;
}

export interface ICurrentTo {
  raw: string;
  value: Address | null;
}

export interface IGetTransaction {
  transaction: EthTx;
  isFullTransaction: boolean; //if the user has filled all the fields
}

export const getTransactionState = (state: AppState) => state.transaction;

export const getCurrentTransactionStatus = (state: AppState) => {
  const { indexingHash } = getSignState(state);
  if (!indexingHash) {
    return false;
  }
  const txExists = getTransactionStatus(state, indexingHash);
  return txExists;
};

export const currentTransactionFailed = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);
  return txExists && !txExists.broadcastSuccessful;
};

// Note: if the transaction or the indexing hash doesn't exist, we have a problem
export const currentTransactionBroadcasting = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && txExists.isBroadcasting;
};

export const currentTransactionBroadcasted = (state: AppState) => {
  const txExists = getCurrentTransactionStatus(state);

  return txExists && !txExists.isBroadcasting;
};

export const isEtherTransaction = (state: AppState) => {
  const unit = getUnit(state);
  const etherUnit = isNetworkUnit(state, unit);
  return etherUnit;
};

export const getCurrentTo = (state: AppState): ICurrentTo =>
  isEtherTransaction(state) ? getTo(state) : getTokenTo(state);

export const getCurrentValue = (state: AppState): ICurrentValue =>
  isEtherTransaction(state) ? getValue(state) : getTokenValue(state);

export const isValidCurrentTo = (state: AppState) => {
  const currentTo = getCurrentTo(state);
  const dataExists = getDataExists(state);
  if (isEtherTransaction(state)) {
    // if data exists the address can be 0x
    return !!currentTo.value || dataExists;
  } else {
    return !!currentTo.value;
  }
};

export const isCurrentToLabelEntry = (state: AppState): boolean => {
  const currentTo = getCurrentTo(state);
  return !currentTo.raw.startsWith('0x');
};

export const isValidGasPrice = (state: AppState): boolean =>
  gasPriceValidator(getGasPrice(state).raw);

export const isValidGasLimit = (state: AppState): boolean =>
  gasLimitValidator(getGasLimit(state).raw);

export function getCurrentToAddressMessage(state: AppState): AddressMessage | undefined {
  const to = getCurrentTo(state);
  return getAddressMessage(to.raw);
}

export const getDataExists = (state: AppState) => {
  const { value } = getData(state);
  return !!value && value.length > 0;
};

export const getValidGasCost = (state: AppState) => {
  const gasCost = getGasCost(state);
  const etherBalance = getEtherBalance(state);
  const isOffline = getOffline(state);
  if (isOffline || !etherBalance) {
    return true;
  }
  return gasCost.lte(etherBalance);
};

export const getToRaw = (state: AppState) => getTo(state).raw;

export const getFrom = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  // attempt to get the from address from the transaction
  if (serializedTransaction) {
    const transactionInstance = new EthTx(serializedTransaction);

    try {
      const from = transactionInstance.from;
      if (from) {
        return toChecksumAddress(from.toString('hex'));
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return getMetaState(state).from;
};

export const getUnit = (state: AppState) => {
  const serializedTransaction = getSerializedTransaction(state);
  const contractInteraction = isContractInteraction(state);
  // attempt to get the to address from the transaction
  if (serializedTransaction && !contractInteraction) {
    const transactionInstance = new EthTx(serializedTransaction);
    const { to } = transactionInstance;
    if (to) {
      // see if any tokens match
      let networkTokens: null | Token[] = null;
      const customTokens = getCustomTokens(state);
      const networkConfig = getNetworkConfig(state);
      if (!networkConfig.isCustom) {
        networkTokens = networkConfig.tokens;
      }
      const mergedTokens = networkTokens ? [...networkTokens, ...customTokens] : customTokens;
      const stringTo = toChecksumAddress(stripHexPrefixAndLower(to.toString('hex')));
      const result = mergedTokens.find(t => t.address === stringTo);
      if (result) {
        return result.symbol;
      }
    }
  }

  return getMetaState(state).unit;
};
export const getPreviousUnit = (state: AppState) => getMetaState(state).previousUnit;
export const getDecimalFromUnit = (state: AppState, unit: string) => {
  if (isNetworkUnit(state, unit)) {
    return getDecimalFromEtherUnit('ether');
  } else {
    const token = getToken(state, unit);
    if (!token) {
      throw Error(`Token ${unit} not found`);
    }
    return token.decimal;
  }
};

export const signaturePending = (state: AppState) => {
  const { isHardwareWallet } = getWalletType(state);
  const { pending } = state.transaction.sign;
  return { isHardwareWallet, isSignaturePending: pending };
};

export const getSerializedTransaction = (state: AppState) =>
  getWalletType(state).isWeb3Wallet ? getWeb3Tx(state) : getSignedTx(state);

export const getParamsFromSerializedTx = (state: AppState): SerializedTxParams => {
  const tx = getSerializedTransaction(state);
  const isEther = isEtherTransaction(state);
  const decimal = getDecimal(state);

  if (!tx) {
    throw Error('Serialized transaction not found');
  }
  const fields = getTransactionFields(makeTransaction(tx));
  const { value, data, gasLimit, gasPrice, to } = fields;
  const currentValue = isEther ? Wei(value) : TokenValue(erc20.transfer.decodeInput(data)._value);
  const currentTo = isEther ? Address(to) : Address(erc20.transfer.decodeInput(data)._to);
  const unit = getUnit(state);
  const fee = Wei(gasLimit).mul(Wei(gasPrice));
  const total = fee.add(Wei(value));
  return { ...fields, currentValue, currentTo, fee, total, unit, decimal, isToken: !isEther };
};

export const getTransaction = (state: AppState): IGetTransaction => {
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const transactionFields = getFields(state);
  const unit = getUnit(state);
  const reducedValues = reduceToValues(transactionFields);
  const transaction: EthTx = makeTransaction(reducedValues);
  const dataExists = getDataExists(state);
  const validGasCost = getValidGasCost(state);
  const isFullTransaction = isFullTx(
    state,
    transactionFields,
    currentTo,
    currentValue,
    dataExists,
    validGasCost,
    unit
  );

  return { transaction, isFullTransaction };
};

export const nonStandardTransaction = (state: AppState): boolean => {
  const etherTransaction = isEtherTransaction(state);
  const { isFullTransaction } = getTransaction(state);
  const dataExists = getDataExists(state);
  return isFullTransaction && dataExists && etherTransaction;
};

export const getGasCost = (state: AppState) => {
  const gasPrice = getGasPrice(state);
  const gasLimit = getGasLimit(state);
  return gasLimit.value ? gasPrice.value.mul(gasLimit.value) : Wei('0');
};

export const serializedAndTransactionFieldsMatch = (state: AppState, isLocallySigned: boolean) => {
  const serialzedTransaction = getSerializedTransaction(state);
  const { transaction, isFullTransaction } = getTransaction(state);
  if (!isFullTransaction || !serialzedTransaction) {
    return false;
  }
  const t1 = getTransactionFields(transaction);
  // inject chainId into t1 as it wont have it from the fields
  const networkConfig = getNetworkConfig(state);
  if (!networkConfig) {
    return false;
  }
  const { chainId } = networkConfig;
  t1.chainId = chainId;

  const t2 = getTransactionFields(makeTransaction(serialzedTransaction));
  const checkValidity = (tx: IHexStrTransaction) =>
    Object.keys(tx).reduce(
      (match, currField: keyof IHexStrTransaction) => match && t1[currField] === t2[currField],
      true
    );
  //reduce both ways to make sure both are exact same
  const transactionsMatch = checkValidity(t1) && checkValidity(t2);
  // if its signed then verify the signature too
  return transactionsMatch && isLocallySigned
    ? makeTransaction(serialzedTransaction).verifySignature()
    : true;
};
