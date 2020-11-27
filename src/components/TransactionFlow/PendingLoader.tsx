import React, { FC } from 'react';

import styled from 'styled-components';

import { Spinner } from '@components';
import { translateRaw } from '@translations';

const SPendingTransaction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const PendingTransaction: FC = () => {
  return (
    <SPendingTransaction>
      <Spinner color="brand" mr={'25px'} />
      <span>
        <b>{translateRaw('PENDING')}</b>
      </span>
    </SPendingTransaction>
  );
};
