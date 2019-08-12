import { gasPriceDefaults } from 'v2/config/data';
import { GasEstimates, Network, IHexStrWeb3Transaction } from 'v2/types';
import { getNetworkByName } from 'v2/services/Store';
import { ProviderHandler } from 'v2/services/EthService';
import { fetchGasEstimates } from './gas';

export function getDefaultEstimates(network: Network | undefined) {
  // Must yield time for testability
  const time = Date.now();
  if (!network) {
    const gasSettings = gasPriceDefaults;
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
    const gasSettings = network.isCustom ? gasPriceDefaults : network.gasPriceSettings;

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

export async function fetchGasPriceEstimates(networkId: string): Promise<GasEstimates> {
  // Don't try on non-estimating network
  const network = getNetworkByName(networkId);
  if (!network || network.isCustom || !network.shouldEstimateGasPrice) {
    const defaultEstimates: GasEstimates = getDefaultEstimates(network);
    return defaultEstimates;
  }
  // Don't try while offline
  /*const isOffline: boolean = yield select(configMetaSelectors.getOffline);
  if (isOffline) {
    yield call(setDefaultEstimates, network);
    return;
  }*/

  // Try to fetch new estimates
  try {
    const estimates: GasEstimates = await fetchGasEstimates();
    return estimates;
  } catch (err) {
    const defaultEstimates: GasEstimates = getDefaultEstimates(network);
    return defaultEstimates;
  }
}

export const getGasEstimate = async (network: Network, tx: IHexStrWeb3Transaction) => {
  const provider = new ProviderHandler(network);
  return await provider.estimateGas(tx);
};
