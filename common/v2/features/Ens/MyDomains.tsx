import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { DashboardPanel, CollapsibleTable, Tooltip, LinkOut } from 'v2/components';
import { translateRaw } from 'v2/translations';
import { breakpointToNumber, BREAK_POINTS } from 'v2/theme';
import { QUERY_GET_ENS_DOMAINS } from './graphql/queries';
import { useQuery } from '@apollo/react-hooks';
import { MyDomainsProps, DomainEntry, DomainEntryTable } from './types';

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

export default function MyDomains({ userAddress }: MyDomainsProps) {
  const { loading, error, data } = useQuery(QUERY_GET_ENS_DOMAINS, {
    variables: { owner: userAddress.toLowerCase() }
  });

  if (loading) {
    return `Loading ...`;
  }
  if (error) {
    return `<div>${JSON.stringify(error)}</div>`;
  }

  if (data.account === null) {
    return ``;
  }

  const domains = data.account.registrations;

  const formatDate = (timestamp: number): string => moment.unix(timestamp).format('YYYY-MM-DD H:mm A');
  const EnsManagerLink = (domain: string): string => `https://app.ens.domains/name/${domain}`;

  const topLevelDomains = domains.filter(
    (domain: DomainEntry) =>
      domain.domain.name === [domain.domain.labelName, domain.domain.parent.name].join('.')
  );
  const myDomains = topLevelDomains.map((domain: DomainEntry) => {
    return { 
      owner: userAddress, 
      domainName: domain.domain.name, 
      expireDate: formatDate(domain.expiryDate),
      expireSoon: domain.expiryDate - moment().unix() <= 2.592e+6 ? true : false
    };
  });

  const domainTable = {
    head: [
      '',
      translateRaw('ENS_MY_DOMAINS_TABLE_OWNER_ADDRESS_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_DOMAIN_NAME_HEADER'),
      translateRaw('ENS_MY_DOMAINS_TABLE_EXPIRES_HEADER'),
      ''
    ],
    body: myDomains.map((domain: DomainEntryTable, index: number) => {
      return [
        <RowAlignment key={index}>
          { domain.expireSoon ? <Tooltip type="warning" tooltip={translateRaw('ENS_EXPIRING_SOON')} /> : ``}
        </RowAlignment>,
        <Label key={2}>{domain.owner}</Label>,
        <RowAlignment key={3} align="left">
          {domain.domainName}
        </RowAlignment>,
        <RowAlignment key={4} align="left">
          {domain.expireDate}
        </RowAlignment>,
        <RowAlignment key={5} align="right">
          <LinkOut link={EnsManagerLink(domain.domainName)} />
        </RowAlignment>
      ];
    }),
    config: {
      primaryColumn: 'Expires',
      sortableColumn: 'Expires'
    }
  };

  return (
    <>
      <DashboardPanel
        heading={
          <>
            {translateRaw('ENS_MY_DOMAINS_TABLE_HEADER')}
          </>
        }
        className={`EarningAssetsTable`}
      >
        <TableContainer>
          <CollapsibleTable
            breakpoint={breakpointToNumber(BREAK_POINTS.SCREEN_XS)}
            {...domainTable}
          />
        </TableContainer>
      </DashboardPanel>
    </>
  );
}