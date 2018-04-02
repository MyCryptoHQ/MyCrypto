import { AppState } from 'reducers';

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

export const dateToUnixTimestamp = (dateObject: Date | null) => {
  if (dateObject) {
    return dateObject.getTime() / 1000;
  }
  return dateObject;
};

export const windowSizeBlockToMin = (numberInput: number | null, scheduleType: string | null) => {
  if (numberInput && scheduleType && scheduleType === 'time') {
    return numberInput * 60;
  }
  return numberInput;
};
