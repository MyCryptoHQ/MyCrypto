import React, { useContext } from 'react';
import styled from 'styled-components';
import { RatesContext } from 'v2/services';
import genericIcon from 'assets/generic.svg';

// Relies on https://github.com/atomiclabs/cryptocurrency-icons using fixed version number through CDN
// @TODO: We should be using our own sprite served over a trusted CDN
const baseURL = 'https://mycryptoapi.com/api/v1/images';

function buildUrl(uuid: string) {
  return `${baseURL}/${uuid}.png`;
}

function getIconUrl(uuid: string, assetIconsManifest: any) {
  const assetIconsManifestEntry =
    assetIconsManifest && assetIconsManifest[uuid] && assetIconsManifest[uuid].coinGeckoId;
  const curr = assetIconsManifest ? assetIconsManifestEntry : false;
  return curr ? buildUrl(uuid) : genericIcon;
}

const SImg = styled('img')`
  height: ${(p: { size: string }) => p.size};
  width: ${(p: { size: string }) => p.size};
`;

interface Props {
  uuid: string;
  size?: string;
  className?: string;
}

function AssetIcon({ uuid, size = '32px', className }: Props) {
  const { assetMapping } = useContext(RatesContext);
  const iconUrl = getIconUrl(uuid, assetMapping);

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
