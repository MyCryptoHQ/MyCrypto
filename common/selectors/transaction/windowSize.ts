import { AppState } from 'reducers';
import { getWindowSize } from './fields';

interface ICurrentWindowSize {
  raw: string;
  value: number | null;
}

const isValidCurrentWindowSize = (state: AppState) => {
  const currentWindowSize = getWindowSize(state);

  return currentWindowSize && currentWindowSize.value && currentWindowSize.value > 0;
};

const getCurrentWindowSize = (state: AppState): ICurrentWindowSize => getWindowSize(state);

export { getCurrentWindowSize, ICurrentWindowSize, isValidCurrentWindowSize };
