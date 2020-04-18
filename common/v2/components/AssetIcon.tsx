import React, { useContext } from 'react';
import styled from 'styled-components';
import { RatesContext } from 'v2/services';

// Relies on https://github.com/atomiclabs/cryptocurrency-icons using fixed version number through CDN
// @TODO: We should be using our own sprite served over a trusted CDN
const baseURL = 'https://mycryptoapi.com/api/v1/images';
const genericURL = 'https://cdn.mycryptoapi.com/v1/icons/generic.svg';

function buildUrl(uuid: string) {
  return `${baseURL}/${uuid}.png`;
}

function getIconUrl(uuid: string, assetIconsManifest: any) {
  const assetIconsManifestEntry =
    assetIconsManifest && assetIconsManifest[uuid] && assetIconsManifest[uuid].coinGeckoId;
  const curr = assetIconsManifest ? assetIconsManifestEntry : false;
  return curr ? buildUrl(uuid) : genericURL;
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

  return <SImg src={iconUrl} size={size} className={className} />;
}

export default AssetIcon;
