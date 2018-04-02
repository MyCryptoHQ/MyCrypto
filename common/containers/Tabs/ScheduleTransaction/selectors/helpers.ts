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
