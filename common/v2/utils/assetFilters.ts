import { StoreAsset, Asset } from 'v2/types';

import {
  AAVE_TOKEN_UUIDS,
  COMPOUND_TOKEN_UUIDS,
  SYNTHETIX_TOKEN_UUIDS,
  UNISWAP_EXCHANGE_TOKEN_UUIDS,
  FULCRUM_TOKEN_UUIDS
} from './constants';

const filterDefiAssets = (assetsToFilter: StoreAsset[] | Asset[], uuidComparisonList: string[]) =>
  assetsToFilter.filter(asset => uuidComparisonList.includes(asset.uuid));

export const filterCompoundAssets = (assetsToFilter: StoreAsset[] | Asset[]) =>
  filterDefiAssets(assetsToFilter, COMPOUND_TOKEN_UUIDS);

export const filterUniswapAssets = (assetsToFilter: StoreAsset[] | Asset[]) =>
  filterDefiAssets(assetsToFilter, UNISWAP_EXCHANGE_TOKEN_UUIDS);

export const filterAaveAssets = (assetsToFilter: StoreAsset[] | Asset[]) =>
  filterDefiAssets(assetsToFilter, AAVE_TOKEN_UUIDS);

export const filterSynthetixAssets = (assetsToFilter: StoreAsset[] | Asset[]) =>
  filterDefiAssets(assetsToFilter, SYNTHETIX_TOKEN_UUIDS);

export const filterFulcrumAssets = (assetsToFilter: StoreAsset[] | Asset[]) =>
  filterDefiAssets(assetsToFilter, FULCRUM_TOKEN_UUIDS);
