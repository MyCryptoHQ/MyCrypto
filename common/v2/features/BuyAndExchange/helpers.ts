import { ZEROEX_CONTAINER_ID } from './constants';

/**
 * Warning!
 * This is a hacky fix designed around 0x/instants limitations
 * as of 11/21/2018. This will need to be changed pretty soon,
 * as it is a quick-moving target.
 */
export const replaceZeroExContainer = (): void => {
  const originalContainer = document.querySelector('div[width="[object Object]"]');

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
