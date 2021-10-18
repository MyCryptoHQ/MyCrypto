import { GAS_PRICE_DEFAULT } from '@config';
import { isEIP1559Supported } from '@helpers';
import { ProviderHandler } from '@services/EthService';
import { GasEstimates, ITxObject, Network, StoreAccount } from '@types';
import { bigNumGasPriceToViewableGwei } from '@utils';

import { estimateFees } from './eip1559';
import { fetchGasEstimates } from './gas';

export function getDefaultEstimates(network?: Network) {
  // Must yield time for testability
  const time = Date.now();
  if (!network) {
    const gasSettings = GAS_PRICE_DEFAULT;
    return {
      safeLow: gasSettings.min,
      standard: gasSettings.initial,
      fast: gasSettings.initial,
      fastest: gasSettings.max,
      isDefault: true,
      chainId: 60,
      time
    };
  } else {
    const gasSettings = network.isCustom ? GAS_PRICE_DEFAULT : network.gasPriceSettings;

    return {
      safeLow: gasSettings.min,
      standard: gasSettings.initial,
      fast: gasSettings.initial,
      fastest: gasSettings.max,
      isDefault: true,
      chainId: network.chainId,
      time
    };
  }
}

export async function fetchGasPriceEstimates(network?: Network): Promise<GasEstimates> {
  // Don't try on non-estimating network
  if (!network || network.isCustom || !network.shouldEstimateGasPrice) {
    const defaultEstimates: GasEstimates = getDefaultEstimates(network);
    return defaultEstimates;
  }

  // Try to fetch new estimates
  return fetchGasEstimates().catch((err) => {
    console.error(err);
    return getDefaultEstimates(network);
  });
}

export async function fetchEIP1559PriceEstimates(network: Network) {
  const provider = new ProviderHandler(network);

  return estimateFees(provider);
}

export type UniversalGasEstimationResult =
  | {
      gasPrice: string; // Gwei
      maxFeePerGas: undefined;
      maxPriorityFeePerGas: undefined;
    }
  | {
      gasPrice: undefined;
      maxFeePerGas: string; // Gwei
      maxPriorityFeePerGas: string; // Gwei
    };

// Returns fast gasPrice or EIP1559 gas params in gwei
export async function fetchUniversalGasPriceEstimate(network?: Network, account?: StoreAccount) {
  if (network && account && isEIP1559Supported(network, account)) {
    const { maxFeePerGas, maxPriorityFeePerGas, baseFee } = await fetchEIP1559PriceEstimates(
      network
    );
    return {
      baseFee,
      estimate: {
        maxFeePerGas: maxFeePerGas && bigNumGasPriceToViewableGwei(maxFeePerGas),
        maxPriorityFeePerGas:
          maxPriorityFeePerGas && bigNumGasPriceToViewableGwei(maxPriorityFeePerGas)
      }
    };
  }

  const { fast } = await fetchGasPriceEstimates(network);

  return { estimate: { gasPrice: fast.toString() } };
}

export const getGasEstimate = async (network: Network, tx: Partial<ITxObject>) => {
  const provider = new ProviderHandler(network);
  return provider.estimateGas(tx);
};
