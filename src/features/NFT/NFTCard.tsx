import React from 'react';

import { Body, Box, LinkApp } from '@components';
import { DEFAULT_NETWORK_TICKER } from '@config';
import { OpenSeaCollection, OpenSeaNFT } from '@services/ApiService/OpenSea';
import { translateRaw } from '@translations';
import { Bigish } from '@types';
import { bigify } from '@utils';

import { NFTCardContent } from './NFTCardContent';

interface Props {
  asset: OpenSeaNFT;
  collection?: OpenSeaCollection;
}

const formatValue = (price: Bigish | undefined) => {
  if (!price) {
    return '?';
  }

  const value = price.toFixed(3);
  return price.lt(0.001) ? '<0.001' : value;
};

export const NFTCard = ({ asset, collection }: Props) => {
  const floor = collection?.stats.floor_price ? bigify(collection?.stats.floor_price) : undefined;

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
      <Box variant="rowAlignTop" justifyContent="space-between" maxWidth="250px">
        <Box variant="columnAlignLeft" mr="1">
          <Body fontSize="12px" m="0" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {asset.collection.name}
          </Body>
          <Body overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {asset.name ?? asset.collection.name}
          </Body>
        </Box>
        <Box variant="columnAlignRight" flexShrink={0}>
          <Body fontSize="12px" m="0" textAlign="right">
            {translateRaw('FLOOR')}
          </Body>
          <Body fontSize="12px" m="0" textAlign="right">
            {formatValue(floor)} {DEFAULT_NETWORK_TICKER}
          </Body>
        </Box>
      </Box>
      <LinkApp isExternal={true} href={asset.permalink} textAlign="center">
        {translateRaw('VIEW_ON_OPENSEA')}
      </LinkApp>
    </Box>
  );
};
