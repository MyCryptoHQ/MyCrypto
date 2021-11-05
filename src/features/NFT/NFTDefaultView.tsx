import { Box } from '@components';
import { CustomOpenSeaCollection, OpenSeaNFT } from '@services/ApiService/OpenSea';
import { SPACING } from '@theme';

import { NFTCard } from './NFTCard';

export const NFTDefaultView = ({
  nftsByCollection
}: {
  nftsByCollection: { nfts: OpenSeaNFT[]; collection: CustomOpenSeaCollection }[];
}) => (
  <Box variant="rowAlign" justifyContent="center" flexWrap="wrap" marginBottom={SPACING.BASE}>
    {nftsByCollection
      .filter(({ nfts }) => nfts.length > 0)
      .flatMap((n) => n.nfts)
      .map((nft) => (
        <NFTCard
          key={nft.id}
          asset={nft}
          collection={nftsByCollection
            .map((n) => n.collection)
            .find((c) => c.slug === nft.collection.slug)}
        />
      ))}
  </Box>
);
