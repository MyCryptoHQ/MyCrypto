import { AppState } from 'reducers';
import moment from 'moment';
import 'moment-timezone';
import { ICurrentScheduleTimestamp } from '.';
import BN from 'bn.js';
import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';

const isWindowStartValid = (transactionFields: AppState['schedule'], latestBlock: string) => {
  const { windowStart } = transactionFields;

  return Boolean(windowStart && windowStart.value && windowStart.value > parseInt(latestBlock, 10));
};

const isScheduleTimestampValid = (transactionFields: AppState['schedule']) => {
  const { scheduleTimestamp, scheduleTimezone } = transactionFields;
  const selectedDate = dateTimeToTimezone(scheduleTimestamp, scheduleTimezone.value);
  return Boolean(selectedDate >= minFromNow(EAC_SCHEDULING_CONFIG.ALLOW_SCHEDULING_MIN_AFTER_NOW));
};

const dateTimeToTimezone = (
  scheduleTimestamp: ICurrentScheduleTimestamp,
  timezone: string
): Date => {
  return moment.tz(scheduleTimestamp.raw, timezone).toDate();
};

const dateTimeToUnixTimestamp = (dateTime: Date): number => {
  return moment(dateTime).unix();
};

const minFromNow = (minutes: number): Date => {
  return moment()
    .add(minutes, 'm')
    .toDate();
};

const windowSizeBlockToMin = (numberInput: BN | null, scheduleType: string | null) => {
  if (numberInput && scheduleType && scheduleType === 'time') {
    return numberInput.mul(new BN(60));
  }
  return numberInput;
};

const calculateWindowStart = (
  scheduleType: string | null,
  scheduleTimestamp: ICurrentScheduleTimestamp,
  scheduleTimezone: string,
  blockWindowStart: number | null
): number =>
  (scheduleType === 'time'
    ? dateTimeToUnixTimestamp(dateTimeToTimezone(scheduleTimestamp, scheduleTimezone))
    : blockWindowStart) || 0;

export {
  isWindowStartValid,
  isScheduleTimestampValid,
  dateTimeToTimezone,
  windowSizeBlockToMin,
  calculateWindowStart,
  minFromNow
};
