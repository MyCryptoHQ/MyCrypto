import { useEffect, useState } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { Box, DashboardPanel, Icon, LinkApp, PoweredByText, Spinner, Text } from '@components';
import { ROUTE_PATHS } from '@config';
import { OpenSeaCollection, OpenSeaNFT, OpenSeaService } from '@services/ApiService/OpenSea';
import { getStoreAccounts, useSelector } from '@store';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';
import { NetworkId } from '@types';
import { mapAsync } from '@utils';

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

const NFT_NETWORKS = ['Ethereum'] as NetworkId[];

export default function NftDashboard() {
  const [assets, setAssets] = useState<OpenSeaNFT[] | null>(null);
  const [collections, setCollections] = useState<OpenSeaCollection[] | null>(null);

  const accounts = useSelector(getStoreAccounts);

  const filteredAccounts = accounts.filter((a) => NFT_NETWORKS.includes(a.networkId));

  useEffect(() => {
    mapAsync(filteredAccounts, async (account) => OpenSeaService.fetchAssets(account.address)).then(
      (result) => {
        setAssets(result.filter((r) => r !== null).flat());
      }
    );

    mapAsync(filteredAccounts, async (account) =>
      OpenSeaService.fetchCollections(account.address)
    ).then((result) => {
      setCollections(result.filter((r) => r !== null).flat());
    });
  }, []);

  console.log(assets);
  console.log(collections);

  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          NFT Dashboard
        </DashboardSubHeader>
        <DashboardPanel
          heading="NFT Dashboard"
          headingRight={
            <Box variant="rowAlign">
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
            {assets ? (
              assets.map((asset) => (
                <NFTCard
                  key={asset.id}
                  asset={asset}
                  collection={collections?.find((c) => c.slug === asset.collection.slug)}
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
