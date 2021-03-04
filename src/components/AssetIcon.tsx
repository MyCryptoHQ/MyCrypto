import React, { useContext } from 'react';

import styled from 'styled-components';

import genericIcon from '@assets/generic.svg';
import { MYC_API } from '@config';
import { StoreContext } from '@services';
import { CoinGeckoManifest } from '@services/Store/StoreProvider';
import { TUuid } from '@types';

import Box from './Box';

const baseURL = `${MYC_API}/images`;

function buildUrl(uuid: TUuid) {
  return `${baseURL}/${uuid}.png`;
}

function getIconUrl(uuid: TUuid, assetIconsManifest: CoinGeckoManifest) {
  const assetIconsManifestEntry = assetIconsManifest && assetIconsManifest[uuid];

  const curr = assetIconsManifestEntry || false;
  return curr ? buildUrl(uuid) : genericIcon;
}

const SImg = styled('img')`
  height: ${(p: { size: string }) => p.size};
  width: ${(p: { size: string }) => p.size};
`;

interface Props {
  uuid: TUuid;
  size?: string;
  className?: string;
}

const AssetIcon = ({ uuid, size = '32px', ...props }: Props & React.ComponentProps<typeof Box>) => {
  const { coinGeckoAssetManifest } = useContext(StoreContext);
  const iconUrl = getIconUrl(uuid, coinGeckoAssetManifest);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const elem = event.currentTarget;
    elem.onerror = null;
    elem.src = genericIcon;
  };

  return (
    <Box variant="rowCenter" {...props} height={size} width={size}>
      <SImg src={iconUrl} size={size} onError={handleError} />
    </Box>
  );
};

export default AssetIcon;
