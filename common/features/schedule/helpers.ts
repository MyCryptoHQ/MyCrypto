import moment from 'moment';
import 'moment-timezone';
import BN from 'bn.js';

import { EAC_SCHEDULING_CONFIG } from 'libs/scheduling';
import * as types from './types';

export interface ICurrentScheduleTimestamp {
  raw: string;
  value: Date;
}

export const isWindowStartValid = (transactionFields: types.ScheduleState, latestBlock: string) => {
  const { windowStart } = transactionFields;

  return Boolean(windowStart && windowStart.value && windowStart.value > parseInt(latestBlock, 10));
};

export const isScheduleTimestampValid = (transactionFields: types.ScheduleState) => {
  const { scheduleTimestamp, scheduleTimezone } = transactionFields;
  const selectedDate = dateTimeToTimezone(scheduleTimestamp, scheduleTimezone.value);
  return Boolean(selectedDate >= minFromNow(EAC_SCHEDULING_CONFIG.ALLOW_SCHEDULING_MIN_AFTER_NOW));
};

export const dateTimeToTimezone = (
  scheduleTimestamp: ICurrentScheduleTimestamp,
  timezone: string
): Date => {
  return moment.tz(scheduleTimestamp.raw, timezone).toDate();
};

export const dateTimeToUnixTimestamp = (dateTime: Date): number => moment(dateTime).unix();

export const minFromNow = (minutes: number): Date =>
  moment()
    .add(minutes, 'm')
    .toDate();

export const windowSizeBlockToMin = (numberInput: BN | null, scheduleType: string | null) => {
  if (numberInput && scheduleType && scheduleType === 'time') {
    return numberInput.mul(new BN(60));
  }
  return numberInput;
};

export const calculateWindowStart = (
  scheduleType: string | null,
  scheduleTimestamp: ICurrentScheduleTimestamp,
  scheduleTimezone: string,
  blockWindowStart: number | null
): number =>
  (scheduleType === 'time'
    ? dateTimeToUnixTimestamp(dateTimeToTimezone(scheduleTimestamp, scheduleTimezone))
    : blockWindowStart) || 0;
