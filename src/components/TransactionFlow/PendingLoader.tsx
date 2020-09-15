import React, { FC } from 'react';

import styled from 'styled-components';

import { translateRaw } from '@translations';

const SPendingTransaction = styled.div`
  display: flex;
  justify-content: flex-end;

  .loading {
    margin-right: 25px;
  }
`;

export const PendingTransaction: FC = () => {
  return (
    <SPendingTransaction>
      <div className="loading" />
      <span>
        <b>{translateRaw('PENDING')}</b>
      </span>
    </SPendingTransaction>
  );
};
