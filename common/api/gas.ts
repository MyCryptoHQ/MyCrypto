import { checkHttpStatus, parseJSON } from './utils';

export interface GasEstimates {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
}

export function fetchGasEstimates(): Promise<GasEstimates> {
  return fetch('https://dev.blockscale.net/api/gasexpress.json', {
    mode: 'cors'
  })
    .then(checkHttpStatus)
    .then(parseJSON);
}
