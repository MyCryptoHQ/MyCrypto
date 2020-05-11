import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { CollapsibleTable, Tooltip, LinkOut, Account } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { breakpointToNumber, BREAK_POINTS } from 'v2/theme';
import { IconID } from 'v2/components/Tooltip';
import { truncate } from 'v2/utils';
import { ENS_MANAGER_URL } from 'v2/config/constants';

import { MyDomainsProps, DomainRecordTableEntry } from './types';

const Label = styled.span`
  display: flex;
  align-items: center;
`;

const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;

const TableContainer = styled.div`
  display: block;
  overflow: auto;
  flex: 1;
  max-height: 600px;
`;

export default function MyDomains({ domainOwnershipRecords }: MyDomainsProps) {
  const formatDate = (timestamp: number): string =>
    moment.unix(timestamp).format('YYYY-MM-DD H:mm A');

  const domainTable = {
    head: [
      '',
      translateRaw('ENS_MY_DOMAINS_TABLE_OWNER_ADDRESS_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_DOMAIN_NAME_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER'),
      ''
    ],
    body: domainOwnershipRecords.map((domain: DomainRecordTableEntry, index: number) => {
      return [
        <RowAlignment key={index}>
          {domain.expireSoon && (
            <Tooltip type={IconID.warning} tooltip={translateRaw('ENS_EXPIRING_SOON')} />
          )}
        </RowAlignment>,
        <Label key={2}>
          <Account title={domain.ownerLabel} address={domain.owner} truncate={truncate} />
        </Label>,
        <RowAlignment key={3} align="left">
          {domain.readableDomainName}
        </RowAlignment>,
        <RowAlignment key={4} align="left">
          {formatDate(domain.expiryDate)}
        </RowAlignment>,
        <RowAlignment key={5} align="right">
          <LinkOut link={`${ENS_MANAGER_URL}/name/${domain.domainName}`} />
        </RowAlignment>
      ];
    }),
    config: {
      primaryColumn: translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER'),
      sortableColumn: translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER')
    }
  };

  return (
    <TableContainer>
      <CollapsibleTable breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)} {...domainTable} />
    </TableContainer>
  );
}
