import { AppState } from 'reducers';
import { getCurrentTo, getCurrentValue } from './current';
import { getFields, getData, getWindowStart, getNonce } from './fields';
import { makeTransaction, IHexStrTransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { getUnit } from 'selectors/transaction/meta';
import { reduceToValues, isFullTx, isWindowStartValid } from 'selectors/transaction/helpers';
import {
  getGasPrice,
  getGasLimit,
  getDataExists,
  getSerializedTransaction,
  getValidGasCost,
  isEtherTransaction
} from 'selectors/transaction';
import { Wei, Address } from 'libs/units';
import { getTransactionFields } from 'libs/transaction/utils/ether';
import { getNetworkConfig, getLatestBlock } from 'selectors/config';
import BN from 'bn.js';
import abi from 'ethereumjs-abi';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

const getTransactionState = (state: AppState) => state.transaction;

export interface IGetTransaction {
  transaction: EthTx;
  isFullTransaction: boolean; //if the user has filled all the fields
}

export interface IGetSchedulingTransaction {
  transaction: EthTx;
  isFullTransaction: boolean;
  isWindowStartValid: boolean;
}

const getTransaction = (state: AppState): IGetTransaction => {
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

const getScheduleData = (
  toAddress: string,
  callData = '',
  callGas: number,
  callValue: BN | null,
  windowSize: number,
  windowStart: any,
  gasPrice: BN | null,
  fee: number,
  payment: any,
  requiredDeposit: any
) => {
  if (!callValue || !gasPrice || !windowStart) {
    return;
  }

  return abi.simpleEncode('schedule(address,bytes,uint[8]):(address)', toAddress, callData, [
    callGas,
    callValue,
    windowSize,
    windowStart,
    gasPrice,
    fee,
    payment,
    requiredDeposit
  ]);
};

const calcEACEndowment = (
  callGas: number | string | BN,
  callValue: number | string | BN,
  gasPrice: number | string | BN,
  fee: number | string | BN,
  payment: number | string | BN
) => {
  const callGasBN = new BN(callGas);
  const callValueBN = new BN(callValue);
  const gasPriceBN = new BN(gasPrice);
  const feeBN = new BN(fee);
  const paymentBN = new BN(payment);

  return paymentBN
    .add(feeBN.mul(new BN(2)))
    .add(callGasBN.mul(gasPriceBN))
    .add(gasPriceBN.mul(new BN(EAC_SCHEDULING_CONFIG.FUTURE_EXECUTION_COST)))
    .add(callValueBN);
};

const getSchedulingTransaction = (state: AppState): IGetSchedulingTransaction => {
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const transactionFields = getFields(state);
  const unit = getUnit(state);
  const dataExists = getDataExists(state);
  const callData = getData(state);
  const validGasCost = getValidGasCost(state);
  const windowStart = getWindowStart(state);
  const gasLimit = getGasLimit(state);
  const nonce = getNonce(state);
  const gasPrice = getGasPrice(state);

  const isFullTransaction = isFullTx(
    state,
    transactionFields,
    currentTo,
    currentValue,
    dataExists,
    validGasCost,
    unit
  );

  const WINDOW_SIZE_IN_BLOCKS = EAC_SCHEDULING_CONFIG.WINDOW_SIZE_IN_BLOCKS;
  const SCHEDULING_GAS_LIMIT = new BN(EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT);
  const EAC_FEE = 0;
  const PAYMENT = EAC_SCHEDULING_CONFIG.PAYMENT;
  const REQUIRED_DEPOSIT = 0;

  const EAC_ADDRESSES = {
    KOVAN: {
      blockScheduler: '0x1afc19a7e642761ba2b55d2a45b32c7ef08269d1'
    }
  };

  const transactionData = getScheduleData(
    currentTo.raw,
    callData.raw,
    parseInt(gasLimit.raw, 10),
    currentValue.value,
    WINDOW_SIZE_IN_BLOCKS,
    windowStart.value,
    gasPrice.value,
    EAC_FEE,
    PAYMENT,
    REQUIRED_DEPOSIT
  );

  const endowment = calcEACEndowment(
    gasLimit.value || 21000,
    currentValue.value || 0,
    gasPrice.value,
    EAC_FEE,
    PAYMENT
  );

  const transactionOptions = {
    to: Address(EAC_ADDRESSES.KOVAN.blockScheduler),
    data: transactionData,
    gasLimit: SCHEDULING_GAS_LIMIT,
    gasPrice: gasPrice.value,
    nonce: new BN(0),
    value: endowment
  };

  if (nonce) {
    transactionOptions.nonce = new BN(nonce.raw);
  }

  const transaction: EthTx = makeTransaction(transactionOptions);

  return {
    transaction,
    isFullTransaction,
    isWindowStartValid: isWindowStartValid(transactionFields, getLatestBlock(state))
  };
};

const nonStandardTransaction = (state: AppState): boolean => {
  const etherTransaction = isEtherTransaction(state);
  const { isFullTransaction } = getTransaction(state);
  const dataExists = getDataExists(state);
  return isFullTransaction && dataExists && etherTransaction;
};

const getGasCost = (state: AppState) => {
  const gasPrice = getGasPrice(state);
  const gasLimit = getGasLimit(state);
  return gasLimit.value ? gasPrice.value.mul(gasLimit.value) : Wei('0');
};

const serializedAndTransactionFieldsMatch = (state: AppState, isLocallySigned: boolean) => {
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

export {
  getSchedulingTransaction,
  getTransaction,
  getTransactionState,
  getGasCost,
  nonStandardTransaction,
  serializedAndTransactionFieldsMatch,
  getScheduleData
};
