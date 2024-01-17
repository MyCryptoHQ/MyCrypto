import { Fragment } from 'react';

import { Body, Box } from '@components';
import { CustomOpenSeaCollection, OpenSeaNFT } from '@services/ApiService/OpenSea';
import { SPACING } from '@theme';

import { NFTCard } from './NFTCard';

export const NFTCollectionView = ({
  nftsByCollection
}: {
  nftsByCollection: { nfts: OpenSeaNFT[]; collection: CustomOpenSeaCollection }[];
}) => (
  <>
    {nftsByCollection
      .filter(({ nfts }) => nfts.length > 0)
      .map(({ nfts, collection }) => (
        <Fragment key={collection.slug}>
          <Body fontWeight="bold" textAlign="center">
            {collection.name}
          </Body>
          <Box
            key={collection.slug}
            variant="rowAlign"
            justifyContent="center"
            flexWrap="wrap"
            marginBottom={SPACING.BASE}
          >
            {nfts.map((nft) => (
              <NFTCard key={nft.id} asset={nft} collection={collection} />
            ))}
          </Box>
        </Fragment>
      ))}
  </>
);
