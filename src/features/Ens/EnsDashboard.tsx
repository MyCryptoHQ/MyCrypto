import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { Box, DashboardPanel, Icon, LinkApp, PoweredByText, Text } from '@components';
import { ROUTE_PATHS } from '@config';
import { getENSFetched, getENSRecords, useSelector } from '@store';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { EnsTable } from './EnsTable';

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

export default function EnsDashboard() {
  const ensOwnershipRecords = useSelector(getENSRecords);
  const isEnsFetched = useSelector(getENSFetched);

  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          {translateRaw('ENS_DASHBOARD_HEADER')}
        </DashboardSubHeader>
        <DashboardPanel
          heading={translateRaw('ENS_MY_DOMAINS_TABLE_HEADER')}
          headingRight={
            <Box variant="rowAlign">
              <LinkApp href={ROUTE_PATHS.SETTINGS.path} mr={SPACING.BASE} variant="opacityLink">
                <Box variant="rowAlign">
                  <Icon type="edit" width="1em" color="BLUE_SKY" />
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
          <EnsTable records={ensOwnershipRecords} isFetched={isEnsFetched} />
        </DashboardPanel>
      </DashboardWrapper>
      {<PoweredByText provider="ENS" />}
    </StyledLayout>
  );
}
