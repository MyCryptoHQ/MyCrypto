import React, { useContext } from 'react';

import styled from 'styled-components';

import genericIcon from '@assets/generic.svg';
import { MYC_API } from '@config';
import { StoreContext } from '@services';
import { CoinGeckoManifest } from '@services/Store/StoreProvider';
import { TUuid } from '@types';

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

function AssetIcon({ uuid, size = '32px', className }: Props) {
  const { coinGeckoAssetManifest } = useContext(StoreContext);
  const iconUrl = getIconUrl(uuid, coinGeckoAssetManifest);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const elem = event.currentTarget;
    elem.onerror = null;
    elem.src = genericIcon;
  };

  return <SImg src={iconUrl} size={size} className={className} onError={handleError} />;
}

export default AssetIcon;
