import React from 'react';
import styled from 'styled-components';

import { Spinner } from '@components';

import { MyDomainsData } from './EnsDashboard';
import NoDomains from './NoEnsDomains';
import MyDomains from './MyDomains';

const SpinnerContainer = styled.div`
  height: 400px;
  display: float;
  align-items: center;
  justify-content: center;
`;

const EnsTableContainer = styled.div`
  max-height: 650px;
  overflow: auto;
`;

export const EnsTable = ({ records, isFetched }: MyDomainsData) => (
  <EnsTableContainer>
    {records.length === 0 &&
      (isFetched ? (
        <NoDomains />
      ) : (
        <SpinnerContainer>
          <Spinner size={'x3'} />
        </SpinnerContainer>
      ))}
    {records.length !== 0 && <MyDomains domainOwnershipRecords={records} />}
  </EnsTableContainer>
);

export default EnsTable;
