import React, { useContext } from 'react';

import { MYC_API } from '@config';
import { StoreContext } from '@services';
import { CoinGeckoManifest } from '@services/Store/StoreProvider';
import { TUuid } from '@types';

import Box from './Box';
import { getSVGIcon } from './Icon';

const baseURL = `${MYC_API}/images`;

function buildUrl(uuid: TUuid) {
  return `${baseURL}/${uuid}.png`;
}

function getIconUrl(uuid: TUuid, assetIconsManifest: CoinGeckoManifest) {
  const assetIconExists = assetIconsManifest && !!assetIconsManifest[uuid];
  return assetIconExists ? buildUrl(uuid) : getSVGIcon('generic-asset-icon');
}

interface Props {
  uuid: TUuid;
  size?: string;
  className?: string;
}

const AssetIcon = ({ uuid, size, ...props }: Props & React.ComponentProps<typeof Box>) => {
  const { coinGeckoAssetManifest } = useContext(StoreContext);
  const iconUrl = getIconUrl(uuid, coinGeckoAssetManifest);

  // Replace src in the eventuality the server fails to reply with the requested icon.
  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const elem = event.currentTarget;
    elem.onerror = null;
    elem.src = getSVGIcon('generic-asset-icon');
  };

  return (
    <Box display="inline-flex" height={size} width={size} {...props}>
      <img src={iconUrl} onError={handleError} />
    </Box>
  );
};

export default AssetIcon;
