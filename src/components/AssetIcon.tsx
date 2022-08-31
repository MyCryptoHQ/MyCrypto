import { ComponentProps, SyntheticEvent } from 'react';

import { MYC_API } from '@config';
import { getCoinGeckoAssetManifest, useSelector } from '@store';
import { TUuid } from '@types';

import Box from './Box';
import { getSVGIcon } from './Icon';

const baseURL = `${MYC_API}/images`;

function buildUrl(uuid: TUuid) {
  return `${baseURL}/${uuid}.png`;
}

function getIconUrl(uuid: TUuid, assetIconsManifest?: TUuid[]) {
  const assetIconExists = assetIconsManifest && assetIconsManifest.includes(uuid);
  return assetIconExists ? buildUrl(uuid) : getSVGIcon('generic-asset-icon');
}

interface Props {
  uuid: TUuid;
  size?: string;
  className?: string;
}

const AssetIcon = ({ uuid, size, ...props }: Props & ComponentProps<typeof Box>) => {
  const coinGeckoAssetManifest = useSelector(getCoinGeckoAssetManifest);
  const iconUrl = getIconUrl(uuid, coinGeckoAssetManifest);

  // Replace src in the eventuality the server fails to reply with the requested icon.
  const handleError = (event: SyntheticEvent<HTMLImageElement, Event>) => {
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
