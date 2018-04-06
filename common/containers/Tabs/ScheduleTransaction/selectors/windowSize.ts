import { AppState } from 'reducers';
import { getWindowSize } from './fields';
import BN from 'bn.js';

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

export { getCurrentWindowSize, ICurrentWindowSize, isValidCurrentWindowSize };
