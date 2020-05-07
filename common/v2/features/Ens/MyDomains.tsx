import React from 'react';
import styled from 'styled-components';
import { CollapsibleTable } from 'v2/components';
import { QUERY_GET_ENS_DOMAINS } from './Queries';
import { useQuery } from '@apollo/react-hooks';

const Label = styled.span`
  display: flex;
  align-items: center;
`;
const RowAlignment = styled.div`
  float: ${(props: { align?: string }) => props.align || 'inherit'};
`;

export default function MyDomains({}) {
  const { loading, error, data } = useQuery(QUERY_GET_ENS_DOMAINS);

  if (loading || error) {
    return ``;
  }

  const domains = data.domains;
  const topLevelDomains = domains.filter(
    (domain) => domain.name === [domain.labelName, domain.parent.labelName].join('.')
  );
  const myDomains = topLevelDomains.map((domain) => {
    return [domain.owner.id, domain.name, '1970-01-01'];
  });

  const domainTable = {
    head: ['Owner Address', 'Domain Name', 'Expire Date'],
    body: myDomains.map((domain, index) => {
      return [
        <Label key={index}>{domain[0]}</Label>,
        <RowAlignment key={index} align="left">
          {domain[1]}
        </RowAlignment>,
        domain[2]
      ];
    }),
    config: {
      primaryColumn: 'Domain Name',
      sortableColumn: 'Expire Date'
    }
  };

  return <CollapsibleTable {...domainTable} />;
}
