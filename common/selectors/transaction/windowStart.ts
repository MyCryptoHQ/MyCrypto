import { AppState } from 'reducers';
import { getWindowStart } from './fields';
import { getLatestBlock } from '../config';

interface ICurrentWindowStart {
  raw: string;
  value: number | null;
}

const isValidCurrentWindowStart = (state: AppState) => {
  const currentWindowStart = getWindowStart(state);

  if (!currentWindowStart.value) {
    return false;
  }

  return currentWindowStart.value > parseInt(getLatestBlock(state), 10);
};

const getCurrentWindowStart = (state: AppState): ICurrentWindowStart => getWindowStart(state);

export { getCurrentWindowStart, ICurrentWindowStart, isValidCurrentWindowStart };
