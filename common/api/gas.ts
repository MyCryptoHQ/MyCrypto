import { Omit } from 'react-redux';

import { checkHttpStatus, parseJSON } from './utils';

const MAX_GAS_FAST = 250;

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
  chainId: number;
  isDefault: boolean;
}

interface GasExpressResponse {
  block_time: number;
  blockNum: number;
  fast: number;
  fastest: number;
  safeLow: number;
  standard: number;
}

export function fetchGasEstimates(): Promise<GasEstimates> {
  return fetch('https://dev.blockscale.net/api/gasexpress.json', {
    mode: 'cors'
  })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then((res: GasExpressResponse) => {
      // Make sure it looks like a raw gas estimate, and it has valid values
      const keys: (keyof Omit<GasExpressResponse, 'block_time' | 'blockNum'>)[] = [
        'safeLow',
        'standard',
        'fast',
        'fastest'
      ];
      keys.forEach(key => {
        if (typeof res[key] !== 'number') {
          throw new Error(
            `Gas estimate API has invalid shape: Expected numeric key '${key}' in response, got '${
              res[key]
            }' instead`
          );
        }
      });

      // Make sure the estimate isn't totally crazy
      const estimateRes = res as RawGasEstimates;
      if (estimateRes.fast > MAX_GAS_FAST) {
        throw new Error(
          `Gas estimate response estimate too high: Max fast is ${MAX_GAS_FAST}, was given ${
            estimateRes.fast
          }`
        );
      }

      if (
        estimateRes.safeLow > estimateRes.standard ||
        estimateRes.standard > estimateRes.fast ||
        estimateRes.fast > estimateRes.fastest
      ) {
        throw new Error(
          `Gas esimates are in illogical order: should be safeLow < standard < fast < fastest, received ${
            estimateRes.safeLow
          } < ${estimateRes.standard} < ${estimateRes.fast} < ${estimateRes.fastest}`
        );
      }

      return estimateRes;
    })
    .then((res: RawGasEstimates) => ({
      ...res,
      time: Date.now(),
      chainId: 1,
      isDefault: false
    }));
}
