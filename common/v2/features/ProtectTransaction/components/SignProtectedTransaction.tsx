import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { WithProtectApi } from '../types';

import ProtectedTransactionBase from './ProtectedTransactionBase';
import ProtectIcon from './icons/ProtectIcon';
import CloseIcon from './icons/CloseIcon';

const SignProtectedTransactionStyled = styled(ProtectedTransactionBase)`
  .SignTransactionKeystore {
    &-title {
      height: auto;
      margin-top: 10px;
    }
  }

  .SignTransactionWeb3 {
    &-img {
      min-width: 100%;
    }
  }
`;

export const SignProtectedTransaction: FC<WithProtectApi> = ({ children, withProtectApi }) => {
  const { goOnInitialStepOrFetchReport } = withProtectApi!;

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (goOnInitialStepOrFetchReport) {
        goOnInitialStepOrFetchReport();
      }
    },
    []
  );

  return (
    <SignProtectedTransactionStyled>
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      {children}
    </SignProtectedTransactionStyled>
  );
};
