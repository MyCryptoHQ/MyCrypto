import { useEffect, useState } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import {
  Box,
  DashboardPanel,
  Icon,
  LinkApp,
  PoweredByText,
  Spinner,
  Switch,
  Text
} from '@components';
import { DEFAULT_NETWORK_TICKER, ROUTE_PATHS } from '@config';
import {
  fetchNFTs,
  getFetched,
  getNFTsByCollection,
  getTotalValue,
  useDispatch,
  useSelector
} from '@store';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { NFTCollectionView } from './NFTCollectionView';
import { NFTDefaultView } from './NFTDefaultView';

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
  const fetched = useSelector(getFetched);
  const nftsByCollection = useSelector(getNFTsByCollection);
  const total = useSelector(getTotalValue);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNFTs());
  }, []);

  const [displayMode, setDisplayMode] = useState(false);

  const toggleDisplayMode = () => {
    setDisplayMode(!displayMode);
  };

  // @todo Empty state
  // @todo Error state

  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          {translateRaw('NFT_DASHBOARD')}
        </DashboardSubHeader>
        <DashboardPanel
          heading={translateRaw('YOUR_NFTS')}
          headingRight={
            <Box variant="rowAlign">
              {fetched && (
                <>
                  <Switch id="display-mode" checked={displayMode} onChange={toggleDisplayMode} />
                  <Box bg="GREY_ATHENS" mr="2" borderRadius="default" p="1">
                    {translateRaw('TOTAL_VALUE', {
                      $value: `${total.toFixed(3)} ${DEFAULT_NETWORK_TICKER}`
                    })}
                  </Box>
                </>
              )}
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
          {fetched ? (
            !displayMode ? (
              <NFTDefaultView nftsByCollection={nftsByCollection} />
            ) : (
              <NFTCollectionView nftsByCollection={nftsByCollection} />
            )
          ) : (
            <Box variant="rowAlign" justifyContent="center" marginBottom={SPACING.BASE}>
              <Spinner size={3} />
            </Box>
          )}
        </DashboardPanel>
      </DashboardWrapper>
      {<PoweredByText provider="OPENSEA" />}
    </StyledLayout>
  );
}
