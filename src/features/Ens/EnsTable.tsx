import React, { useContext } from 'react';

import styled from 'styled-components';

import { Spinner } from '@components';
import { StoreContext } from '@services';

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

export const EnsTable = () => {
  const { ensOwnershipRecords, isEnsFetched } = useContext(StoreContext);
  return (
    <EnsTableContainer>
      {ensOwnershipRecords.length === 0 &&
        (isEnsFetched ? (
          <NoDomains />
        ) : (
          <SpinnerContainer>
            <Spinner size={'x3'} />
          </SpinnerContainer>
        ))}
      {ensOwnershipRecords.length !== 0 && (
        <MyDomains domainOwnershipRecords={ensOwnershipRecords} />
      )}
    </EnsTableContainer>
  );
};

export default EnsTable;
