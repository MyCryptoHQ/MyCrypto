import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Heading } from '@mycrypto/ui';
import moment from 'moment';

import { StoreContext, EnsService } from 'v2/services';
import { DashboardPanel } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { BREAK_POINTS, SPACING } from 'v2/theme';
import { useEffectOnce, usePromise } from 'v2/vendor/react-use';
import { isEthereumAccount } from 'v2/services/Store/Account/helpers';
import { SECONDS_IN_MONTH } from 'v2/config/constants';

import { DomainRecordTableEntry, DomainNameRecord } from './types';
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

const isLessThanAMonth = (date: number, now: number) => date - now <= SECONDS_IN_MONTH;

export interface MyDomainsData {
  records: DomainRecordTableEntry[];
  isFetched: boolean;
}

const defaultData: MyDomainsData = {
  records: [] as DomainRecordTableEntry[],
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
            records: data.map((record) => ({
              ...record,
              expireSoon: isLessThanAMonth(record.expiryDate, moment().unix())
            })),
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
