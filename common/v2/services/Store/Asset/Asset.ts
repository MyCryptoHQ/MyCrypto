import { create, read, update, destroy, readAll, createWithID } from '../LocalCache';

export const createAsset = create('assets');
export const createAssetWithID = createWithID('assets');
export const readAsset = read('assets');
export const updateAsset = update('assets');
export const deleteAsset = destroy('assets');
export const readAssets = readAll('assets');
