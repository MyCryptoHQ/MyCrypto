import { AppState } from 'reducers';
import BN from 'bn.js';
import { getWindowSize } from 'selectors/schedule';

interface ICurrentWindowSize {
  raw: string;
  value: BN | null;
}

const isValidCurrentWindowSize = (state: AppState) => {
  const currentWindowSize = getWindowSize(state);

  return (
    currentWindowSize &&
    currentWindowSize.value &&
    currentWindowSize.value.gt(new BN(0)) &&
    currentWindowSize.value.bitLength() <= 256
  );
};

const getCurrentWindowSize = (state: AppState): ICurrentWindowSize => getWindowSize(state);

const isWindowSizeValid = (state: AppState): boolean => {
  const windowSize = getWindowSize(state);

  return Boolean(windowSize && windowSize.value && windowSize.value.bitLength() <= 256);
};

export { getCurrentWindowSize, ICurrentWindowSize, isWindowSizeValid, isValidCurrentWindowSize };
