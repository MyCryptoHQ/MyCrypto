import { createAsset as createAssetRedux, getAssets, useDispatch, useSelector } from '@store';
import { ExtendedAsset, TUuid } from '@types';

import { getAssetByUUID as getAssetByUUIDFunc } from './helpers';

export interface IAssetContext {
  assets: ExtendedAsset[];
  createAsset(assetData: ExtendedAsset, id: TUuid): void;
  getAssetByUUID(uuid: TUuid): ExtendedAsset | undefined;
  addAssetsFromAPI(newAssets: Record<TUuid, ExtendedAsset>): void;
}

function useAssets() {
  const assets = useSelector(getAssets);
  const dispatch = useDispatch();

  const createAsset = (asset: ExtendedAsset) => dispatch(createAssetRedux(asset));

  const getAssetByUUID = (uuid: TUuid) => getAssetByUUIDFunc(assets)(uuid);

  return { assets, createAsset, getAssetByUUID };
}

export default useAssets;
