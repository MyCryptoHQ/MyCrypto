import { useContext } from 'react';

import { ExtendedAsset, LSKeys, TUuid } from '@types';
import { EXCLUDED_ASSETS } from '@config';
import { pipe, map, mergeLeft, toPairs, reduce, pickBy } from '@vendor';

import { DataContext } from '../DataManager';
import { getAssetByUUID as getAssetByUUIDFunc } from './helpers';

export interface IAssetContext {
  assets: ExtendedAsset[];
  createAssetWithID(assetData: ExtendedAsset, id: TUuid): void;
  getAssetByUUID(uuid: TUuid): ExtendedAsset | undefined;
  addAssetsFromAPI(newAssets: Record<TUuid, ExtendedAsset>): void;
}

function useAssets() {
  const { createActions, assets } = useContext(DataContext);
  const model = createActions(LSKeys.ASSETS);

  const createAssetWithID = (assetData: ExtendedAsset, id: TUuid) =>
    model.createWithID(assetData, id);

  const getAssetByUUID = (uuid: TUuid) => getAssetByUUIDFunc(assets)(uuid);

  const addAssetsFromAPI = (newAssets: Record<TUuid, ExtendedAsset>) => {
    const setIsCustom = (a: ExtendedAsset) => ({ ...a, isCustom: false });
    const mergeAssets = pipe(
      reduce(
        (acc, a: ExtendedAsset) => ({ ...acc, [a.uuid]: a }),
        {} as Record<TUuid, ExtendedAsset>
      ), // Transform user custom assets into object
      mergeLeft(
        map(
          setIsCustom,
          pickBy((_, key) => !EXCLUDED_ASSETS.includes(key), newAssets)
        )
      ), // UUID is unique so we can merge user and api assets
      toPairs, // Equivalent of Object.entries -> [k, v]
      map(([uuid, a]) => ({ ...a, uuid } as ExtendedAsset)) // We Need to add the uuid key to the api asset.
    );
    model.updateAll(mergeAssets(assets));
  };

  return { assets, createAssetWithID, getAssetByUUID, addAssetsFromAPI };
}

export default useAssets;
