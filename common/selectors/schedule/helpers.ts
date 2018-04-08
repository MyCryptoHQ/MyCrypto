import { AppState } from 'reducers';
import moment from 'moment';
import 'moment-timezone';
import { ICurrentScheduleTimestamp } from '.';
import BN from 'bn.js';

export const isWindowStartValid = (
  transactionFields: AppState['schedule'],
  latestBlock: string
) => {
  const { windowStart } = transactionFields;

  return Boolean(windowStart && windowStart.value && windowStart.value > parseInt(latestBlock, 10));
};

export const isScheduleTimestampValid = (transactionFields: AppState['schedule']) => {
  const { scheduleTimestamp } = transactionFields;
  const now = new Date();

  return Boolean(scheduleTimestamp && scheduleTimestamp.value && scheduleTimestamp.value > now);
};

export const dateTimeToUnixTimestamp = (
  scheduleTimestamp: ICurrentScheduleTimestamp,
  timezone: string
) => {
  if (scheduleTimestamp.value) {
    return moment.tz(scheduleTimestamp.raw, timezone).unix();
  }
  return scheduleTimestamp.value;
};

export const windowSizeBlockToMin = (numberInput: BN | null, scheduleType: string | null) => {
  if (numberInput && scheduleType && scheduleType === 'time') {
    return numberInput.mul(new BN(60));
  }
  return numberInput;
};

export const calculateWindowStart = (
  scheduleType: string | null,
  scheduleTimestamp: any,
  scheduleTimezone: string,
  blockWindowStart: number | null
): number =>
  (scheduleType === 'time'
    ? dateTimeToUnixTimestamp(scheduleTimestamp, scheduleTimezone)
    : blockWindowStart) || 0;
