import React from 'react';

import path from 'ramda/src/path';

import { VerticalStepper } from '@components';
import { ITokenMigrationConfig, ITxStatus, TxParcel } from '@types';

export interface TokenMigrationMultiTxConfirmProps {
  currentTxIdx: number;
  transactions: TxParcel[];
  tokenMigrationConfig: ITokenMigrationConfig;
  onComplete?(): void;
}

export default function ConfirmTokenMigration({
  currentTxIdx,
  transactions,
  tokenMigrationConfig,
  onComplete
}: TokenMigrationMultiTxConfirmProps) {
  const status = transactions.map((t) => path(['status'], t));

  const broadcastingIndex = status.findIndex((s) => s === ITxStatus.BROADCASTED);
  const steps = tokenMigrationConfig.txConstructionConfigs.map((txConstructionConfig) => ({
    title: txConstructionConfig.stepTitle,
    icon: txConstructionConfig.stepSvg,
    content: txConstructionConfig.stepContent,
    buttonText: txConstructionConfig.actionBtnText,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick: onComplete
  }));

  return (
    <div>
      <VerticalStepper
        currentStep={broadcastingIndex === -1 ? currentTxIdx : broadcastingIndex}
        steps={steps}
      />
    </div>
  );
}
