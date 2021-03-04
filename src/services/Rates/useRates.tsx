import { useContext } from 'react';

import { isEmpty } from 'ramda';
import { useDispatch } from 'react-redux';

import { DataContext, useSettings } from '@services/Store';
import { trackAsset } from '@store';
import { Asset, ExtendedAsset, ReserveAsset, TUuid } from '@types';

export interface IRatesContext {
  getAssetRate(asset: Asset): number | undefined;
  getAssetRateInCurrency(asset: Asset, currency: string): number | undefined;
  getPoolAssetReserveRate(defiPoolTokenUUID: string, assets: Asset[]): ReserveAsset[];
}

const DEFAULT_FIAT_RATE = 0;

function useRates() {
  const { rates, trackedAssets } = useContext(DataContext);
  const { settings } = useSettings();

  const dispatch = useDispatch();

  const getAssetRate = (asset: ExtendedAsset) => {
    const uuid = asset.uuid;
    if (!isEmpty(rates) && !rates[uuid] && !trackedAssets[uuid]) {
      dispatch(trackAsset(asset));
      return DEFAULT_FIAT_RATE;
    }
    return rates[uuid]
      ? rates[uuid][(settings.fiatCurrency as string).toLowerCase()]
      : DEFAULT_FIAT_RATE;
  };

  const getAssetRateInCurrency = (asset: ExtendedAsset, currency: string) => {
    const uuid = asset.uuid;
    if (!isEmpty(rates) && !rates[uuid] && !trackedAssets[uuid]) {
      dispatch(trackAsset(asset));
      return DEFAULT_FIAT_RATE;
    }
    return rates[uuid] ? rates[uuid][currency.toLowerCase()] : DEFAULT_FIAT_RATE;
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
