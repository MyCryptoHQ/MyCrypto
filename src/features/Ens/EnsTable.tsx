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

export const EnsTable = ({
  records,
  isFetched
}: {
  records: DomainNameRecord[];
  isFetched: boolean;
}) => {
  return (
    <>
      {records.length === 0 &&
        (isFetched ? (
          <NoDomains />
        ) : (
          <SpinnerContainer>
            <Spinner size={3} />
          </SpinnerContainer>
        ))}
      {records.length !== 0 && <MyDomains domainOwnershipRecords={records} />}
    </>
  );
};

export default EnsTable;
