import React from 'react';

import styled from 'styled-components';

import { DomainNameRecord } from '@types';

import MyDomains from './MyDomains';
import NoDomains from './NoEnsDomains';

const EnsTableContainer = styled.div`
  max-height: 650px;
  overflow: auto;
`;

export const EnsTable = ({ records }: { records: DomainNameRecord[] }) => (
  <EnsTableContainer>
    {records.length === 0 ? <NoDomains /> : <MyDomains domainOwnershipRecords={records} />}
  </EnsTableContainer>
);

export default EnsTable;
