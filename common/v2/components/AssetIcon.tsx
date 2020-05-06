import React, { useContext } from 'react';
import styled from 'styled-components';
import { StoreContext } from 'v2/services';
import { TUuid } from 'v2/types';
import { MYC_API } from 'v2/config';
import { CoinGeckoManifest } from 'v2/services/Store/StoreProvider';

import genericIcon from 'assets/generic.svg';

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
  width: auto;
`;

interface Props {
  uuid: TUuid;
  size?: string;
  className?: string;
}

function AssetIcon({ uuid, size = '32px', className }: Props) {
  const { coinGeckoAssetManifest } = useContext(StoreContext);
  const iconUrl = getIconUrl(uuid, coinGeckoAssetManifest);
  return (
    <SImg
      src={iconUrl}
      size={size}
      onError={(e) => {
        // @ts-ignore: onError works, but ts error
        e.target.onerror = null;
        // @ts-ignore: onError works, but ts error
        e.target.src = genericIcon;
      }}
      className={className}
    />
  );
}

export default AssetIcon;
