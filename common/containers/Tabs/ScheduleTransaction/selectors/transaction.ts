import { AppState } from 'reducers';
import {
  IGetTransaction,
  getCurrentTo,
  getCurrentValue,
  getFields,
  getUnit,
  getDataExists,
  getData,
  getValidGasCost,
  getScheduleType,
  getWindowStart,
  getNonce,
  getGasPrice,
  getTimeBounty,
  getWindowSize,
  getScheduleGasPrice,
  isValidScheduleGasPrice,
  getScheduleGasLimit,
  isValidScheduleGasLimit,
  isValidScheduleDeposit,
  getScheduleDeposit,
  getScheduleTimestamp
} from 'selectors/transaction';
import { Address, gasPriceToBase } from 'libs/units';
import {
  EAC_SCHEDULING_CONFIG,
  getScheduleData,
  calcEACEndowment,
  EAC_ADDRESSES
} from 'libs/scheduling';
import BN from 'bn.js';
import { makeTransaction } from 'libs/transaction';
import {
  isFullTx,
  isWindowSizeValid,
  isWindowStartValid,
  isScheduleTimestampValid,
  dateToUnixTimestamp,
  windowSizeBlockToMin
} from 'selectors/transaction/helpers';
import EthTx from 'ethereumjs-tx';
import { getLatestBlock } from 'selectors/config';

const getSchedulingTransaction = (state: AppState): IGetTransaction => {
  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const transactionFields = getFields(state);
  const unit = getUnit(state);
  const dataExists = getDataExists(state);
  const callData = getData(state);
  const validGasCost = getValidGasCost(state);
  const scheduleType = getScheduleType(state);
  const windowStart = getWindowStart(state);
  const windowSize = getWindowSize(state);
  const nonce = getNonce(state);
  const gasPrice = getGasPrice(state);
  const timeBounty = getTimeBounty(state);
  const windowSizeValid = isWindowSizeValid(transactionFields);
  const windowStartValid = isWindowStartValid(transactionFields, getLatestBlock(state));
  const scheduleTimestamp = getScheduleTimestamp(state);
  const scheduleTimestampValid = isScheduleTimestampValid(transactionFields);
  const scheduleGasPrice = getScheduleGasPrice(state);
  const scheduleGasPriceValid = isValidScheduleGasPrice(state);
  const scheduleGasLimit = getScheduleGasLimit(state);
  const scheduleGasLimitValid = isValidScheduleGasLimit(state);
  const depositValid = isValidScheduleDeposit(state);
  const deposit = getScheduleDeposit(state);

  const isFullTransaction =
    isFullTx(state, transactionFields, currentTo, currentValue, dataExists, validGasCost, unit) &&
    (windowStartValid || scheduleTimestampValid) &&
    windowSizeValid &&
    scheduleGasPriceValid &&
    scheduleGasLimitValid &&
    depositValid;

  const transactionData = getScheduleData(
    currentTo.raw,
    callData.raw,
    scheduleGasLimit.value,
    currentValue.value,
    windowSizeBlockToMin(windowSize.value, scheduleType.value),
    scheduleType.value === 'time'
      ? dateToUnixTimestamp(scheduleTimestamp.value)
      : windowStart.value,
    scheduleGasPrice.value,
    timeBounty.value,
    deposit.value
  );

  const endowment = calcEACEndowment(
    scheduleGasLimit.value || EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_LIMIT_FALLBACK,
    currentValue.value || new BN(0),
    scheduleGasPrice.value || gasPriceToBase(EAC_SCHEDULING_CONFIG.SCHEDULE_GAS_PRICE_FALLBACK),
    timeBounty.value
  );

  const transactionOptions = {
    to: Address(
      scheduleType.value === 'time'
        ? EAC_ADDRESSES.KOVAN.timestampScheduler
        : EAC_ADDRESSES.KOVAN.blockScheduler
    ),
    data: transactionData,
    gasLimit: EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT,
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
    isFullTransaction
  };
};

export { getSchedulingTransaction };
