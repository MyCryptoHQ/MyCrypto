import { Asset, ExtendedAsset, NetworkId } from '@types';

export const filterValidAssets = (assets: Asset[] | ExtendedAsset[], networkId: NetworkId) =>
  assets.filter(
    ({ networkId: id, type }) => (type === 'base' || type === 'erc20') && id === networkId
  );
