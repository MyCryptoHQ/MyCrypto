import React from 'react';

import styled from 'styled-components';

import { Spinner } from '@components';
import { BREAK_POINTS, SPACING } from '@theme';
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
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-bottom: ${SPACING.BASE};
  }
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
            <Spinner size={3} />
          </SpinnerContainer>
        ))}
      {records.length !== 0 && <MyDomains domainOwnershipRecords={records} />}
    </EnsTableContainer>
  );
};

export default EnsTable;
