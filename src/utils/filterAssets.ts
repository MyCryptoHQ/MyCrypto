import { ASSET_DROPDOWN_SIZE_THRESHOLD } from '@config';
import { Asset, ExtendedAsset, NetworkId } from '@types';

import { USEFUL_ASSETS } from './constants';

// Attempts to filter assets for display in dropdowns to decrease # of selections
// based on a simple list of estimated usefulness (# of holders, market cap, trade volume) from etherscan
export const filterDropdownAssets = (assets: Asset[] | ExtendedAsset[]) => {
  const filteredAssets =
    assets.length > ASSET_DROPDOWN_SIZE_THRESHOLD
      ? assets.filter(({ uuid, type }) => type === 'base' || USEFUL_ASSETS.includes(uuid))
      : assets;
  return filteredAssets;
};

export const filterValidAssets = (assets: Asset[] | ExtendedAsset[], networkId: NetworkId) =>
  assets.filter(
    ({ networkId: id, type }) => (type === 'base' || type === 'erc20') && id === networkId
  );
