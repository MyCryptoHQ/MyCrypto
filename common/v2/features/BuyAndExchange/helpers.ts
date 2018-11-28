import { DepositStatuses } from 'v2/services';
import { ZEROEX_CONTAINER_ID } from './constants';

export const replaceZeroExContainer = (): void => {
  const originalContainer = document.querySelector('.zeroExInstantMainContainer');

  if (originalContainer) {
    const wrapper = document.getElementById(ZEROEX_CONTAINER_ID);
    const grandparent = originalContainer.parentNode!.parentNode;

    wrapper!.appendChild(originalContainer);

    (grandparent as any).remove();
  }
};

export const getSecondsRemaining = (expiration: number): number => {
  const secondsRemaining = Math.floor((+new Date(expiration) - Date.now()) / 1000);

  return secondsRemaining;
};

export const getTimeRemaining = (expiration: number): string => {
  const secondsRemaining = getSecondsRemaining(expiration);
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining - minutes * 60;
  const minutesSide = minutes < 10 ? `0${minutes}` : minutes;
  const secondsSide = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutesSide}:${secondsSide}`;
};

export const getStatusWording = (status: DepositStatuses): string => {
  switch (status) {
    case DepositStatuses.error:
      return 'There was an error with this ShapeShift transaction.';
    case DepositStatuses.out_of_time:
      return 'The time has run out for this transaction.';
    case DepositStatuses.no_deposits:
      return 'Waiting on a deposit.';
    case DepositStatuses.received:
      return 'Deposit received.';
    case DepositStatuses.complete:
      return 'Transaction completed.';
    default:
      return '';
  }
};
