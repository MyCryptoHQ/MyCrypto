import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';

import { StoreContext } from '@services';
import EnsService from '@services/ApiService/Ens/EnsService.ts';
import { DashboardPanel } from '@components';
import { translateRaw } from '@translations';
import { BREAK_POINTS, SPACING } from '@theme';
import { useEffectOnce, usePromise } from '@vendor/react-use';
import { isEthereumAccount } from '@services/Store/Account/helpers';

import { DomainNameRecord } from './types';
import EnsLogo from './EnsLogo';
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

export interface MyDomainsData {
  records: DomainNameRecord[];
  isFetched: boolean;
}

const defaultData: MyDomainsData = {
  records: [] as DomainNameRecord[],
  isFetched: false
};

export default function EnsDashboard() {
  const { accounts } = useContext(StoreContext);
  const [ensOwnershipRecords, setEnsOwnershipRecords] = useState(defaultData);
  const mounted = usePromise();

  // Only use the accounts on the Ethereum mainnet network
  const accountsEthereumNetwork = accounts.filter(isEthereumAccount);

  useEffectOnce(() => {
    (async () => {
      const ownershipRecords: MyDomainsData = await mounted(
        EnsService.fetchOwnershipRecords(accountsEthereumNetwork).then(
          (data: DomainNameRecord[]) => ({
            records: data,
            isFetched: true
          })
        )
      );
      setEnsOwnershipRecords(ownershipRecords);
    })();
  });

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
          <EnsTable
            records={ensOwnershipRecords.records}
            isFetched={ensOwnershipRecords.isFetched}
          />
        </DashboardPanel>
      </DashboardWrapper>
    </StyledLayout>
  );
}
