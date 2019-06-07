import { getNetworkByName } from 'v2/libs/networks/networks';
import { Network } from 'v2/services/Network/types';
import { gasPriceDefaults } from 'config/data';
import { GasEstimates, fetchGasEstimates } from 'v2/api/gas';

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
