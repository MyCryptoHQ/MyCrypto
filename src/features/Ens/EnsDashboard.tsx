import React, { useContext } from 'react';

import { Heading } from '@mycrypto/ui';
import styled from 'styled-components';

import { DashboardPanel, PoweredByText } from '@components';
import { StoreContext } from '@services';
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
  const { ensOwnershipRecords, isEnsFetched } = useContext(StoreContext);
  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          {translateRaw('ENS_DASHBOARD_HEADER')}
        </DashboardSubHeader>
        <DashboardPanel
          heading={translateRaw('ENS_MY_DOMAINS_TABLE_HEADER')}
          headingRight={<PoweredByText provider="ENS" />}
        >
          <EnsTable records={ensOwnershipRecords} isFetched={isEnsFetched} />
        </DashboardPanel>
      </DashboardWrapper>
    </StyledLayout>
  );
}
