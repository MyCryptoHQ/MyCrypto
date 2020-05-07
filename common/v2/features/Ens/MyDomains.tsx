import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { CollapsibleTable } from 'v2/components';
import { QUERY_GET_ENS_DOMAINS } from './graphql/queries';
import { useQuery } from '@apollo/react-hooks';
import { MyDomainsProps, DomainEntry, DomainEntryTable } from './types';
import { Heading } from '@mycrypto/ui';

const Label = styled.span`
  display: flex;
  align-items: center;
`;
const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
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
    return <Heading as="h5">{userAddress} owns no top level domains</Heading>;
  }

  const domains = data.account.registrations;

  const formatDate = (timestamp: number): string => moment.unix(timestamp).format('YYYY-MM-DD h:mm A');

  const topLevelDomains = domains.filter(
    (domain: DomainEntry) =>
      domain.domain.name === [domain.domain.labelName, domain.domain.parent.name].join('.')
  );
  const myDomains = topLevelDomains.map((domain: DomainEntry) => {
    return { owner: userAddress, domainName: domain.domain.name, expireDate: formatDate(domain.expiryDate) };
  });

  const domainTable = {
    head: [
      'Owner Address',
      'Domain Name',
      'Expires',
      <RowAlignment key={0} align="right">
        Configure
      </RowAlignment>
    ],
    body: myDomains.map((domain: DomainEntryTable, index: number) => {
      return [
        <Label key={index}>{domain.owner}</Label>,
        <RowAlignment key={index} align="left">
          {domain.domainName}
        </RowAlignment>,
        domain.expireDate,
        <RowAlignment key={index} align="right">
          [+]
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
      <Heading as="h5">
        ENS Names for {userAddress} ({myDomains.length} domains)
      </Heading>
      <CollapsibleTable {...domainTable} />
    </>
  );
}
