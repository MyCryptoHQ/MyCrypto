import React from 'react';

import styled from 'styled-components';

import { Spinner } from '@components';
import { DomainNameRecord } from '@types';

import MyDomains from './MyDomains';
import NoDomains from './NoEnsDomains';

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

export const EnsTable = ({
  records,
  isFetched
}: {
  records: DomainNameRecord[];
  isFetched: boolean;
}) => {
  return (
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
};

export default EnsTable;
