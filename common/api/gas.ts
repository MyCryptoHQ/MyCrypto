import { checkHttpStatus, parseJSON } from './utils';

interface RawGasEstimates {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
  block_time: number;
  blockNum: number;
}

export interface GasEstimates {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
  time: number;
  isDefault: boolean;
}

export function fetchGasEstimates(): Promise<GasEstimates> {
  return fetch('https://dev.blockscale.net/api/gasexpress.json', {
    mode: 'cors'
  })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then((req: RawGasEstimates) => ({
      ...req,
      time: Date.now(),
      isDefault: false
    }));
}
