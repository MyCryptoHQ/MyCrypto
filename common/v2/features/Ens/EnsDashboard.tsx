import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';

import { StoreContext } from 'v2/services';
import { Spinner, DashboardPanel } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { BREAK_POINTS, SPACING } from 'v2/theme';
import { useEffectOnce } from 'v2/vendor/react-use';
import { isLabelHashENS } from 'v2/services/EthService/validators';
import { EnsSubgraphService } from 'v2/services/ApiService/TheGraph';

import { DomainTableEntry } from './types';
import MyDomains from './MyDomains';
import NoDomains from './NoEnsDomains';
import EnsLogo from './EnsLogo';

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

const SpinnerContainer = styled.div`
  height: 400px;
  display: float;
  align-items: center;
  justify-content: center;
`;

interface MyDomainsDate {
  data: DomainTableEntry[];
  isFetched: boolean;
}

const defaultData: MyDomainsDate = {
  data: [] as DomainTableEntry[],
  isFetched: false
};

export default function EnsDashboard() {
  const { accounts } = useContext(StoreContext);
  const [fetchedEnsData, setEnsData] = useState(defaultData);

  useEffectOnce(() => {
    EnsSubgraphService.instance
      .fetchOwnershipRecords(accounts)
      .then((data: DomainTableEntry[]) => setEnsData({ data: data || [], isFetched: true }));
  });

  const domainEntries = fetchedEnsData.data.map((ownedENSEntry) => ({
    ...ownedENSEntry,
    domainName: !isLabelHashENS(ownedENSEntry.domainName)
      ? ownedENSEntry.domainName
      : translateRaw('ENS_DOMAIN_UNKNOWN_NAME')
  }));

  return (
    <StyledLayout>
      <DashboardWrapper>
        <DashboardSubHeader as="h2" className="Dashboard-desktop-top-left-heading">
          {translateRaw('ENS_DASHBOARD_HEADER')}
        </DashboardSubHeader>
        <DashboardPanel
          heading={translateRaw('ENS_MY_DOMAINS_TABLE_HEADER')}
          headingRight={<EnsLogo />}
        >
          {fetchedEnsData.data.length === 0 &&
            (fetchedEnsData.isFetched ? (
              <NoDomains />
            ) : (
              <SpinnerContainer>
                <Spinner size={'x3'} />
              </SpinnerContainer>
            ))}
          {fetchedEnsData.data.length !== 0 && <MyDomains domainEntries={domainEntries} />}
        </DashboardPanel>
      </DashboardWrapper>
    </StyledLayout>
  );
}
