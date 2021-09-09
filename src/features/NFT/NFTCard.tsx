import React from 'react';

import { Body, Box, LinkApp } from '@components';
import { OpenSeaCollection, OpenSeaNFT } from '@services/ApiService/OpenSea';

import { NFTCardContent } from './NFTCardContent';

interface Props {
  asset: OpenSeaNFT;
  collection?: OpenSeaCollection;
}

export const NFTCard = ({ asset, collection }: Props) => {
  const floor = collection?.stats.floor_price;

  return (
    <Box
      p="3"
      m="2"
      variant="columnAlignLeft"
      borderWidth="1.70146px"
      borderStyle="solid"
      borderColor="BLUE_BRIGHT"
      borderRadius="5px"
      maxWidth="300px"
    >
      <Box>
        <NFTCardContent nft={asset} />
      </Box>
      <Box variant="rowAlignTop" justifyContent="space-between">
        <Box variant="columnAlignLeft">
          <Body fontSize="12px" m="0" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {asset.collection.name}
          </Body>
          <Body overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {asset.name ?? asset.collection.name}
          </Body>
        </Box>
        <Box variant="columnAlignRight" flexShrink={0}>
          <Body fontSize="12px" m="0" textAlign="right">
            Floor
          </Body>
          <Body fontSize="12px" m="0" textAlign="right">
            {floor ? floor.toFixed(2) : '?'} ETH
          </Body>
        </Box>
      </Box>
      <LinkApp isExternal={true} href={asset.permalink} textAlign="center">
        View on OpenSea
      </LinkApp>
    </Box>
  );
};
