import { useContext } from 'react';

import { SettingsContext } from '@services/Store';
import { IRates, TTicker, Asset, ReserveAsset } from '@types';
import { notUndefined } from '@utils';
import { RatesContext } from './RatesProvider';

export interface IRatesContext {
  rates: IRates;
  getRate(ticker: TTicker): number | undefined;
  getRateInCurrency(ticker: TTicker, currency: string): number | undefined;
  getAssetRate(asset: Asset): number | undefined;
  getAssetRateInCurrency(asset: Asset, currency: string): number | undefined;
  getPoolAssetReserveRate(defiPoolTokenUUID: string, assets: Asset[]): ReserveAsset[];
}

const DEFAULT_FIAT_RATE = 0;

function useRates() {
  const { rates, reserveRateMapping } = useContext(RatesContext);
  const { settings } = useContext(SettingsContext);

  const getRate = (ticker: TTicker) => {
    if (!rates[ticker]) return DEFAULT_FIAT_RATE;
    return settings && settings.fiatCurrency
      ? rates[ticker][(settings.fiatCurrency as string).toLowerCase()]
      : DEFAULT_FIAT_RATE;
  };

  const getRateInCurrency = (ticker: TTicker, currency: string) => {
    if (!rates[ticker]) return DEFAULT_FIAT_RATE;
    return rates[ticker][currency.toLowerCase()];
  };

  const getAssetRate = (asset: Asset) => {
    const uuid = asset.uuid;
    if (!rates[uuid]) return DEFAULT_FIAT_RATE;
    return settings && settings.fiatCurrency
      ? rates[uuid][(settings.fiatCurrency as string).toLowerCase()]
      : DEFAULT_FIAT_RATE;
  };

  const getAssetRateInCurrency = (asset: Asset, currency: string) => {
    const uuid = asset.uuid;
    if (!rates[uuid]) return DEFAULT_FIAT_RATE;
    return rates[uuid][currency.toLowerCase()];
  };

  const getPoolAssetReserveRate = (uuid: string, assets: Asset[]) => {
    const reserveRateObject = reserveRateMapping[uuid];
    if (!reserveRateObject) return [];
    return reserveRateObject.reserveRates
      .map((item) => {
        const detectedReserveAsset = assets.find((asset) => asset.uuid === item.assetId);
        if (!detectedReserveAsset) return;

        return { ...detectedReserveAsset, reserveExchangeRate: item.rate };
      })
      .filter(notUndefined);
  };

  return {
    rates,
    getRate,
    getRateInCurrency,
    getAssetRate,
    getAssetRateInCurrency,
    getPoolAssetReserveRate
  };
}

export default useRates;
