import { useEffect, useState } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { Body, Box, DashboardPanel, Icon, LinkApp, PoweredByText, Text } from '@components';
import { ROUTE_PATHS } from '@config';
import { OpenSeaNFT, OpenSeaService } from '@services/ApiService/OpenSea';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';

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
  const [assets, setAssets] = useState<OpenSeaNFT[]>([]);

  useEffect(() => {
    OpenSeaService.fetchAssets('0xe77162b7d2ceb3625a4993bab557403a7b706f18').then((result) => {
      setAssets(result ?? []);
    });
  }, []);

  console.log(assets);

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
          <Box variant="rowAlign" justifyContent="center">
            {assets &&
              assets.map((asset) => (
                <Box key={asset.id} p="3">
                  <img
                    src={asset.image_url}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '2px',
                      width: '200px',
                      height: '200px'
                    }}
                  />
                  <Body fontSize="12px" m="0">
                    {asset.collection.name}
                  </Body>
                  <Body>{asset.name}</Body>
                  <LinkApp isExternal={true} href={asset.permalink}>
                    View on OpenSea
                  </LinkApp>
                </Box>
              ))}
          </Box>
        </DashboardPanel>
      </DashboardWrapper>
      {<PoweredByText provider="OPENSEA" />}
    </StyledLayout>
  );
}
