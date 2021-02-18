import { useContext } from 'react';

import { useSettings } from '@services/Store';
import { Asset, ReserveAsset, TUuid } from '@types';

import { RatesContext } from './RatesProvider';

export interface IRatesContext {
  getAssetRate(asset: Asset): number | undefined;
  getAssetRateInCurrency(asset: Asset, currency: string): number | undefined;
  getPoolAssetReserveRate(defiPoolTokenUUID: string, assets: Asset[]): ReserveAsset[];
}

const DEFAULT_FIAT_RATE = 0;

function useRates() {
  const { rates, trackAsset } = useContext(RatesContext);
  const { settings } = useSettings();

  const getAssetRate = (asset: Asset) => {
    const uuid = asset.uuid;
    if (!rates[uuid]) {
      trackAsset(uuid);
      return DEFAULT_FIAT_RATE;
    }
    return settings && settings.fiatCurrency
      ? rates[uuid][(settings.fiatCurrency as string).toLowerCase()]
      : DEFAULT_FIAT_RATE;
  };

  const getAssetRateInCurrency = (asset: Asset, currency: string) => {
    const uuid = asset.uuid;
    if (!rates[uuid]) {
      trackAsset(uuid);
      return DEFAULT_FIAT_RATE;
    }
    return rates[uuid][currency.toLowerCase()];
  };

  /*
   * Depetcated method, to reactivate see 10aa0311d1827b0c7c6e8f55dea10fd953c93e61
   * returns an empty object to avoid type errors
   **/

  const getPoolAssetReserveRate = (_uuid: TUuid, _assets: Asset[]) => [] as ReserveAsset[];

  return {
    getAssetRate,
    getAssetRateInCurrency,
    getPoolAssetReserveRate
  };
}

export default useRates;
