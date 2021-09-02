import { useEffect } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { Box, DashboardPanel, Icon, LinkApp, PoweredByText, Spinner, Text } from '@components';
import { ROUTE_PATHS } from '@config';
import { useDispatch, useSelector } from '@store';
import { fetchNFTs, getCollections, getNFTs, getTotalValue } from '@store/nft.slice';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { NFTCard } from './NFTCard';

const DashboardWrapper = styled.div`
  width: 100%;
`;

const DashboardSubHeader = styled(Heading)`
  margin-top: ${SPACING.NONE};
  font-weight: bold;
  margin-bottom: ${SPACING.BASE};
`;

const StyledLayout = styled.div`
  width: 960px;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  .Layout-content {
    padding: ${SPACING.NONE};
  }
`;

export default function NftDashboard() {
  const nfts = useSelector(getNFTs);
  const collections = useSelector(getCollections);
  const total = useSelector(getTotalValue);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNFTs());
  }, []);

  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          NFT Dashboard
        </DashboardSubHeader>
        <DashboardPanel
          heading="Your NFTs"
          headingRight={
            <Box variant="rowAlign">
              <Box bg="GREY_ATHENS" mr="2" borderRadius="default" p="1">
                Total Value: {total.toFixed(3)} ETH
              </Box>
              <LinkApp href={ROUTE_PATHS.SETTINGS.path} mr={SPACING.BASE} variant="opacityLink">
                <Box variant="rowAlign">
                  <Icon type="edit" width="1em" />
                  <Text ml={SPACING.XS} mb={0}>
                    {translateRaw('EDIT')}
                  </Text>
                </Box>
              </LinkApp>
              <LinkApp href={ROUTE_PATHS.ADD_ACCOUNT.path} variant="opacityLink">
                <Box variant="rowAlign">
                  <Icon type="add-bold" width="1em" />
                  <Text ml={SPACING.XS} mb={0}>
                    {translateRaw('ADD')}
                  </Text>
                </Box>
              </LinkApp>
            </Box>
          }
        >
          <Box
            variant="rowAlign"
            justifyContent="center"
            flexWrap="wrap"
            marginBottom={SPACING.BASE}
          >
            {nfts ? (
              nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  asset={nft}
                  collection={collections?.find((c) => c.slug === nft.collection.slug)}
                />
              ))
            ) : (
              <Spinner size={3} />
            )}
          </Box>
        </DashboardPanel>
      </DashboardWrapper>
      {<PoweredByText provider="OPENSEA" />}
    </StyledLayout>
  );
}
