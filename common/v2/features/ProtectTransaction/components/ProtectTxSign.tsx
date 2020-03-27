import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { SPACING } from 'v2/theme';
import { ProtectIcon, CloseIcon } from 'v2/components/icons';

import { IWithProtectApi } from '../types';
import ProtectTxBase from './ProtectTxBase';

const SignProtectedTransaction = styled(ProtectTxBase)`
  .SignTransactionKeystore {
    &-title {
      height: auto;
      margin-top: ${SPACING.SM};
    }
  }

  .SignTransactionWeb3 {
    &-img {
      min-width: 100%;
    }
  }
`;

export const ProtectTxSign: FC<IWithProtectApi> = ({ children, withProtectApi }) => {
  const { goToInitialStepOrFetchReport } = withProtectApi!;

  const onProtectMyTransactionCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement & SVGSVGElement, MouseEvent>) => {
      e.preventDefault();

      if (goToInitialStepOrFetchReport) {
        goToInitialStepOrFetchReport();
      }
    },
    []
  );

  return (
    <SignProtectedTransaction>
      <CloseIcon size="lg" onClick={onProtectMyTransactionCancelClick} />
      <ProtectIcon size="lg" />
      {children}
    </SignProtectedTransaction>
  );
};
