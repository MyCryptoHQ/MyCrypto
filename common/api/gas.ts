import { Omit } from 'react-redux';

import { checkHttpStatus, parseJSON } from './utils';
import store from '../features';
import * as configSelectors from '../features/config/selectors';
import { NetworkConfig } from 'types/network';
import { NODE_CONFIGS } from '../libs/nodes';
import RpcNode from '../libs/nodes/rpc';
import { Wei } from '../libs/units';
import BN from 'bn.js';

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
  return fetch('https://gas.mycryptoapi.com', {
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
            `Gas estimate API has invalid shape: Expected numeric key '${key}' in response, got '${res[key]}' instead`
          );
        }
      });

      // Make sure the estimate isn't totally crazy
      const estimateRes = res as RawGasEstimates;
      if (estimateRes.fast > MAX_GAS_FAST) {
        throw new Error(
          `Gas estimate response estimate too high: Max fast is ${MAX_GAS_FAST}, was given ${estimateRes.fast}`
        );
      }

      if (
        estimateRes.safeLow > estimateRes.standard ||
        estimateRes.standard > estimateRes.fast ||
        estimateRes.fast > estimateRes.fastest
      ) {
        throw new Error(
          `Gas estimates are in illogical order: should be safeLow < standard < fast < fastest, received ${estimateRes.safeLow} < ${estimateRes.standard} < ${estimateRes.fast} < ${estimateRes.fastest}`
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

export function fetchGasEstimatesRPC(): Promise<GasEstimates> {
  const network: NetworkConfig = configSelectors.getNetworkConfig(store.getState());
  let nodeUrl = null;
  // @ts-ignore
  for (const nodeConfig of NODE_CONFIGS[network.id]) {
    if (nodeConfig.type === 'rpc') {
      nodeUrl = nodeConfig.url;
      break;
    }
  }

  if (!nodeUrl) {
    throw new Error(
      `Failed to fetch gas estimates: no RPC node found for network  + ${network.id}`
    );
  }

  const node = new RpcNode(nodeUrl);
  return node
    .gasPrice()
    .then((gasPriceWei: Wei) => {
      // The following formatting is done to ensure round gas prices numbers in GWei (needed for the gas price slider
      // component to work as expected)
      // Additionally we set values for 'safeLow', 'fast' and 'fastest' gas prices from network configuration and from
      // the 'standard' gas price we got from the RPC node (also needed for the gas price slider component to work
      // as expected)
      const bigBillion = new BN(1000000000);
      const bigTwo: BN = new BN(2);
      const gasPriceGwei: BN = gasPriceWei.div(bigBillion);

      // @ts-ignore
      const newtworkGasPriceSetting = network.gasPriceSettings;
      const networkMinGasPriceGwei: BN = new BN(newtworkGasPriceSetting.min);
      const networkMaxGasPriceGwei: BN = new BN(newtworkGasPriceSetting.max);

      // Setting safeLowGasPriceGwei: equal to networkMinGasPriceGwei
      const safeLowGasPriceGwei: BN = networkMinGasPriceGwei;

      // Setting standardGasPriceGwei: greater or equal to networkMinGasPriceGwei
      let standardGasPriceGwei: BN;
      if (gasPriceGwei.gt(networkMinGasPriceGwei)) {
        standardGasPriceGwei = gasPriceGwei;
      } else {
        standardGasPriceGwei = networkMinGasPriceGwei;
      }

      // Setting fastestGasPriceGwei: equal to networkMaxGasPriceGwei if greater than RPC gasPriceGwei, equal to RPC
      // gasPriceGwei otherwise
      let fastestGasPriceGwei: BN;
      if (networkMaxGasPriceGwei.gt(gasPriceGwei)) {
        fastestGasPriceGwei = networkMaxGasPriceGwei;
      } else {
        fastestGasPriceGwei = gasPriceGwei;
      }

      // Setting fastGasPriceGwei: lower than or equal to fastestGasPriceGwei. If possible fastGasPriceGwei is set to
      // 1.5 * standardGasPriceGwei
      let fastGasPriceGwei: BN = standardGasPriceGwei.add(standardGasPriceGwei.div(bigTwo));
      if (fastGasPriceGwei.gt(fastestGasPriceGwei)) {
        fastGasPriceGwei = fastestGasPriceGwei;
      }

      const estimateRes = {
        safeLow: safeLowGasPriceGwei.toNumber(),
        standard: standardGasPriceGwei.toNumber(),
        fast: fastGasPriceGwei.toNumber(),
        fastest: fastestGasPriceGwei.toNumber()
      };

      // Make sure the estimate isn't totally crazy
      if (estimateRes.fast > MAX_GAS_FAST) {
        throw new Error(
          `Gas estimate response estimate too high: Max fast is ${MAX_GAS_FAST}, was given ${estimateRes.fast}`
        );
      }

      if (
        estimateRes.safeLow > estimateRes.standard ||
        estimateRes.standard > estimateRes.fast ||
        estimateRes.fast > estimateRes.fastest
      ) {
        throw new Error(
          `Gas estimates are in illogical order: should be safeLow < standard < fast < fastest, received ${estimateRes.safeLow} < ${estimateRes.standard} < ${estimateRes.fast} < ${estimateRes.fastest}`
        );
      }
      return estimateRes;
    })
    .then((res: RawGasEstimates) => ({
      ...res,
      time: Date.now(),
      chainId: network.chainId,
      isDefault: false
    }));
}
