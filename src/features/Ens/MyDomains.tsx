import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { Tooltip, LinkOut, Account, FixedSizeCollapsibleTable } from '@components';
import { translateRaw } from '@translations';
import { breakpointToNumber, BREAK_POINTS } from '@theme';
import { IconID } from '@components/Tooltip';
import { ENS_MANAGER_URL, SECONDS_IN_MONTH } from '@config/constants';

import { MyDomainsProps, DomainNameRecord } from './types';

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;

const isLessThanAMonth = (date: number, now: number) => date - now <= SECONDS_IN_MONTH;

export default function MyDomains({ domainOwnershipRecords }: MyDomainsProps) {
  const formatDate = (timestamp: number): string =>
    moment.unix(timestamp).format('YYYY-MM-DD H:mm A');

  const domainTable = {
    head: [
      '',
      translateRaw('ENS_MY_DOMAINS_TABLE_OWNER_ADDRESS_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_DOMAIN_NAME_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_RENEW_HEADER')
    ],
    body: domainOwnershipRecords.map((record: DomainNameRecord, index: number) => {
      return [
        <RowAlignment key={index}>
          {isLessThanAMonth(record.expiryDate, moment().unix()) && (
            <Tooltip type={IconID.warning} tooltip={translateRaw('ENS_EXPIRING_SOON')} />
          )}
        </RowAlignment>,
        <Label key={2}>
          <Account title={record.ownerLabel} address={record.owner} truncate={true} />
        </Label>,
        <RowAlignment key={3} align="left">
          {record.readableDomainName}
        </RowAlignment>,
        <RowAlignment key={4} align="left">
          {formatDate(record.expiryDate)}
        </RowAlignment>,
        <RowAlignment key={5} align="left">
          <LinkOut link={`${ENS_MANAGER_URL}/name/${record.domainName}?utm_source=mycrypto`} />
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
