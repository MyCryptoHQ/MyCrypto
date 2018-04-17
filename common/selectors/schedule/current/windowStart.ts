import { AppState } from 'reducers';
import { getLatestBlock } from 'selectors/config';
import { getWindowStart } from '../fields';

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
