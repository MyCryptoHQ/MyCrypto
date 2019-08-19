import React from 'react';
import styled from 'styled-components';
import manifest from 'cryptocurrency-icons/manifest.json';

import { IAsset, TSymbol } from 'v2/types';
// Relies on https://github.com/atomiclabs/cryptocurrency-icons using fixed version number through CDN
// @TODO: We should be using our own sprite served over a trusted CDN
const baseURL = 'https://cdn.mycryptoapi.com/v1/icons';

function buildUrl(symbol: TSymbol) {
  return `${baseURL}/${symbol.toLowerCase()}.svg`;
}

function getIconUrl(symbol: TSymbol) {
  const curr = manifest.find((c: IAsset) => c.symbol === symbol);
  return curr ? buildUrl(symbol) : buildUrl('generic' as TSymbol);
}

const SImg = styled('img')`
  height: ${(p: { size: string }) => p.size};
`;

interface Props {
  symbol: TSymbol;
  size?: string;
}

function AssetIcon({ symbol, size = '32px' }: Props) {
  const iconUrl = getIconUrl(symbol);

  return <SImg src={iconUrl} size={size} />;
}

export default AssetIcon;
