import { checkHttpStatus, parseJSON } from './utils';

export interface GasEstimates {
  safeLow: number;
  standard: number;
  fast: number;
  fastest: number;
}

export function getGasEstimates(): Promise<GasEstimates> {
  return fetch('https://dev.blockscale.net/api/gasexpress.json')
    .then(checkHttpStatus)
    .then(parseJSON);
}
