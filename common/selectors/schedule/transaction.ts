import { AppState } from 'reducers';
import {
  getCurrentTo,
  getCurrentValue,
  getData,
  getNonce,
  getGasPrice,
  IGetTransaction,
  getTransaction
} from 'selectors/transaction';
import {
  getScheduleType,
  getWindowStart,
  getTimeBounty,
  getWindowSize,
  getScheduleGasPrice,
  getScheduleGasLimit,
  getScheduleDeposit,
  getScheduleTimestamp,
  getScheduleTimezone,
  isValidCurrentTimeBounty,
  isWindowSizeValid,
  isValidScheduleGasPrice,
  isValidScheduleGasLimit,
  isValidScheduleDeposit
} from 'selectors/schedule';
import {
  EAC_SCHEDULING_CONFIG,
  getScheduleData,
  calcEACEndowment,
  getSchedulerAddress
} from 'libs/scheduling';
import BN from 'bn.js';
import { makeTransaction } from 'libs/transaction';
import EthTx from 'ethereumjs-tx';
import { getLatestBlock } from 'selectors/config';
import {
  windowSizeBlockToMin,
  calculateWindowStart,
  isWindowStartValid,
  isScheduleTimestampValid
} from 'selectors/schedule/helpers';
import { getScheduleState } from 'selectors/schedule/fields';

export const getSchedulingTransaction = (state: AppState): IGetTransaction => {
  const { isFullTransaction } = getTransaction(state);

  const currentTo = getCurrentTo(state);
  const currentValue = getCurrentValue(state);
  const nonce = getNonce(state);
  const gasPrice = getGasPrice(state);
  const timeBounty = getTimeBounty(state);
  const scheduleGasPrice = getScheduleGasPrice(state);
  const scheduleGasLimit = getScheduleGasLimit(state);
  const scheduleType = getScheduleType(state);

  const endowment = calcEACEndowment(
    scheduleGasLimit.value,
    currentValue.value,
    scheduleGasPrice.value,
    timeBounty.value
  );

  let transactionData = null;

  const transactionFullAndValid = isFullTransaction && isSchedulingTransactionValid(state);

  if (transactionFullAndValid) {
    const deposit = getScheduleDeposit(state);
    const scheduleTimestamp = getScheduleTimestamp(state);
    const windowSize = getWindowSize(state);
    const callData = getData(state);
    const scheduleTimezone = getScheduleTimezone(state);
    const windowStart = getWindowStart(state);

    transactionData = getScheduleData(
      currentTo.raw,
      callData.raw,
      scheduleGasLimit.value,
      currentValue.value,
      windowSizeBlockToMin(windowSize.value, scheduleType.value),
      calculateWindowStart(
        scheduleType.value,
        scheduleTimestamp,
        scheduleTimezone.value,
        windowStart.value
      ),
      scheduleGasPrice.value,
      timeBounty.value,
      deposit.value
    );
  }

  const transactionOptions = {
    to: getSchedulerAddress(scheduleType.value),
    data: transactionData,
    gasLimit: EAC_SCHEDULING_CONFIG.SCHEDULING_GAS_LIMIT,
    gasPrice: gasPrice.value,
    nonce: new BN(0),
    value: endowment
  };

  if (nonce) {
    transactionOptions.nonce = new BN(nonce.raw);
  }

  const schedulingTransaction: EthTx = makeTransaction(transactionOptions);

  return {
    transaction: schedulingTransaction,
    isFullTransaction: transactionFullAndValid
  };
};

const isSchedulingTransactionValid = (state: AppState): boolean => {
  const schedulingState = getScheduleState(state);
  const windowSizeValid = isWindowSizeValid(state);
  const windowStartValid = isWindowStartValid(schedulingState, getLatestBlock(state));
  const scheduleTimestampValid = isScheduleTimestampValid(schedulingState);
  const scheduleGasPriceValid = isValidScheduleGasPrice(state);
  const scheduleGasLimitValid = isValidScheduleGasLimit(state);
  const depositValid = isValidScheduleDeposit(state);
  const timeBountyValid = isValidCurrentTimeBounty(state);

  return (
    (windowStartValid || scheduleTimestampValid) &&
    windowSizeValid &&
    scheduleGasPriceValid &&
    scheduleGasLimitValid &&
    depositValid &&
    timeBountyValid
  );
};
