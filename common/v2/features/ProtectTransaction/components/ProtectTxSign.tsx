import React, { FC, useCallback } from 'react';
import styled from 'styled-components';

import { SPACING } from 'v2/theme';
import { ProtectIcon, CloseIcon } from 'v2/components/icons';
import { ITxConfig } from 'v2/types';
import SignTransaction from 'v2/features/SendAssets/components/SignTransaction';

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

interface Props extends IWithProtectApi {
  txConfig: ITxConfig;
  handleProtectTxConfirmAndSend(payload: ITxConfig, cb: () => void, isWeb3Wallet: boolean): void;
}

export const ProtectTxSign: FC<Props> = props => {
  const { withProtectApi, txConfig, handleProtectTxConfirmAndSend } = props;
  const {
    goToInitialStepOrFetchReport,
    handleTransactionReport,
    goToNextStep,
    withProtectState: { isWeb3Wallet }
  } = withProtectApi!;

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
      <SignTransaction
        txConfig={txConfig}
        onComplete={(payload: ITxConfig) => {
          handleTransactionReport().then(() => {
            handleProtectTxConfirmAndSend(payload, goToNextStep, isWeb3Wallet);
          });
        }}
        resetFlow={goToInitialStepOrFetchReport}
      />
    </SignProtectedTransaction>
  );
};
