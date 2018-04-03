import { AppState } from 'reducers';
import moment from 'moment';
import 'moment-timezone';

export const isWindowSizeValid = (transactionFields: AppState['transaction']['fields']) => {
  const { windowSize } = transactionFields;

  return Boolean(windowSize && windowSize.value);
};

export const isWindowStartValid = (
  transactionFields: AppState['transaction']['fields'],
  latestBlock: string
) => {
  const { windowStart } = transactionFields;

  return Boolean(windowStart && windowStart.value && windowStart.value > parseInt(latestBlock, 10));
};

export const isScheduleTimestampValid = (transactionFields: AppState['transaction']['fields']) => {
  const { scheduleTimestamp } = transactionFields;
  const now = new Date();

  return Boolean(scheduleTimestamp && scheduleTimestamp.value && scheduleTimestamp.value > now);
};

export const dateTimeToUnixTimestamp = (scheduleTimestamp: any, timezone: string) => {
  if (scheduleTimestamp.value) {
    return moment.tz(scheduleTimestamp.raw, timezone).unix();
  }
  return scheduleTimestamp.value;
};

export const windowSizeBlockToMin = (numberInput: number | null, scheduleType: string | null) => {
  if (numberInput && scheduleType && scheduleType === 'time') {
    return numberInput * 60;
  }
  return numberInput;
};
