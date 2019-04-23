import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createAssetOption = create('assetOptions');
export const readAssetOption = read('assetOptions');
export const updateAssetOption = update('assetOptions');
export const deleteAssetOption = destroy('assetOptions');
export const readAssetOptions = readAll('assetOptions');
