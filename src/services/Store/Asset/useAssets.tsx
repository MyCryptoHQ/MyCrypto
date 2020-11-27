import { useContext } from 'react';

import {
  addAssetsFromAPI as addAssetsFromAPIRedux,
  createAsset as createAssetRedux,
  useDispatch
} from '@store';

import { ExtendedAsset, TUuid } from '@types';

import { DataContext } from '../DataManager';
import { getAssetByUUID as getAssetByUUIDFunc } from './helpers';

export interface IAssetContext {
  assets: ExtendedAsset[];
  createAsset(assetData: ExtendedAsset, id: TUuid): void;
  getAssetByUUID(uuid: TUuid): ExtendedAsset | undefined;
  addAssetsFromAPI(newAssets: Record<TUuid, ExtendedAsset>): void;
}

function useAssets() {
  const { assets } = useContext(DataContext);
  const dispatch = useDispatch();

  const createAsset = (asset: ExtendedAsset) => dispatch(createAssetRedux(asset));

  const getAssetByUUID = (uuid: TUuid) => getAssetByUUIDFunc(assets)(uuid);

  const addAssetsFromAPI = (newAssets: Record<TUuid, ExtendedAsset>) =>
    dispatch(addAssetsFromAPIRedux(newAssets));

  return { assets, createAsset, getAssetByUUID, addAssetsFromAPI };
}

export default useAssets;
