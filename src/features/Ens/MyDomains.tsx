import styled from 'styled-components';

import { Account, Box, FixedSizeCollapsibleTable, Icon, LinkApp, Tooltip } from '@components';
import { ENS_MANAGER_URL, SECONDS_IN_MONTH } from '@config/constants';
import { useContacts } from '@services/Store';
import { BREAK_POINTS, breakpointToNumber } from '@theme';
import { translateRaw } from '@translations';
import { DomainNameRecord, TAddress } from '@types';
import { formatDateTime, getTimeDifference } from '@utils';

import { MyDomainsProps } from './types';

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const RowAlignment = styled.div<{ align?: string }>`
  float: ${({ align = 'inherit' }) => align};
`;

export default function MyDomains({ domainOwnershipRecords }: MyDomainsProps) {
  const { getContactByAddressAndNetworkId } = useContacts();
  const domainTable = {
    head: [
      '',
      translateRaw('ENS_MY_DOMAINS_TABLE_OWNER_ADDRESS_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_DOMAIN_NAME_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_RENEW_HEADER')
    ],
    body: domainOwnershipRecords.map((record: DomainNameRecord, index: number) => {
      const unixTimestamp = parseInt(record.expiryDate, 10);
      return [
        <RowAlignment key={index}>
          {getTimeDifference(new Date(), unixTimestamp) < SECONDS_IN_MONTH && (
            <Tooltip type="warning" tooltip={translateRaw('ENS_EXPIRING_SOON')} />
          )}
        </RowAlignment>,
        <Label key={2}>
          <Account
            title={getContactByAddressAndNetworkId(record.owner as TAddress, 'Ethereum')?.label}
            address={record.owner}
            truncate={true}
          />
        </Label>,
        <RowAlignment key={3} align="left">
          {record.readableDomainName}
        </RowAlignment>,
        <RowAlignment key={4} align="left">
          {formatDateTime(unixTimestamp)}
        </RowAlignment>,
        <RowAlignment key={5} align="left">
          <LinkApp
            isExternal={true}
            href={`${ENS_MANAGER_URL}/name/${record.domainName}?utm_source=mycrypto`}
          >
            <Box display={'inline-flex'} alignItems={'center'}>
              <Icon type="link-out" width="1em" />
            </Box>
          </LinkApp>
        </RowAlignment>
      ];
    }),
    config: {
      primaryColumn: translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER'),
      sortableColumn: translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER')
    }
  };

  return (
    <FixedSizeCollapsibleTable
      maxHeight={'800px'}
      breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
      {...domainTable}
    />
  );
}
