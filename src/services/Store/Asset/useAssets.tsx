import { useContext } from 'react';
import pipe from 'ramda/src/pipe';
import reduce from 'ramda/src/reduce';
import mergeLeft from 'ramda/src/mergeLeft';
import map from 'ramda/src/map';
import toPairs from 'ramda/src/toPairs';
import omitBy from 'lodash/omitBy';

import { ExtendedAsset, LSKeys, TUuid } from '@types';
import { EXCLUDED_ASSETS } from '@config';

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

  const createAssetWithID = model.createWithID;

  const getAssetByUUID = (uuid: TUuid) => getAssetByUUIDFunc(assets)(uuid);

  const addAssetsFromAPI = (newAssets: Record<TUuid, ExtendedAsset>) => {
    const setIsCustom = (a: ExtendedAsset) => ({ ...a, isCustom: false });
    const mergeAssets = pipe(
      reduce(
        (acc, a: ExtendedAsset) => ({ ...acc, [a.uuid]: a }),
        {} as Record<TUuid, ExtendedAsset>
      ), // Transform user custom assets into object
      mergeLeft(
        map<any, any>(
          setIsCustom,
          omitBy(newAssets, (_, key) => EXCLUDED_ASSETS.includes(key))
        )
      ), // UUID is unique so we can merge user and api assets
      toPairs, // Equivalent of Object.entries -> [k, v]
      map(([uuid, a]) => ({ ...a, uuid })) // We Need to add the uuid key to the api asset.
    );
    model.updateAll(mergeAssets(assets));
  };
  return { assets, createAssetWithID, getAssetByUUID, addAssetsFromAPI };
}

export default useAssets;
