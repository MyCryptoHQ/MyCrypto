import { RawTransactionValues } from '../SendAssets/SendAssets';
import { getNetworkByAddress } from 'v2/libs/networks/networks';
import { NetworkOptions } from 'v2/services/NetworkOptions/types';
import { gasPriceDefaults } from 'config/data';
import { GasEstimates, fetchGasEstimates } from 'v2/api/gas';

export function getDefaultEstimates(network: NetworkOptions | undefined) {
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

export async function fetchGasPriceEstimates(
  transaction: RawTransactionValues
): Promise<GasEstimates> {
  // Don't try on non-estimating network
  const transactionSender = transaction.from;
  const network = getNetworkByAddress(transactionSender);
  console.log('1');
  if (!network || network.isCustom || !network.shouldEstimateGasPrice) {
    console.log('2');
    const defaultEstimates: GasEstimates = getDefaultEstimates(network);
    return defaultEstimates;
  }
  console.log('3');
  // Don't try while offline
  /*const isOffline: boolean = yield select(configMetaSelectors.getOffline);
  if (isOffline) {
    yield call(setDefaultEstimates, network);
    return;
  }*/

  // Try to fetch new estimates
  try {
    console.log('4');
    const estimates: GasEstimates = await fetchGasEstimates();
    console.log('5');
    console.log(estimates);
    return estimates;
  } catch (err) {
    console.warn('Failed to fetch gas estimates:', err);
    const defaultEstimates: GasEstimates = getDefaultEstimates(network);
    return defaultEstimates;
  }
}
