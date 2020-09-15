import React from 'react';

import path from 'ramda/src/path';

import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import { VerticalStepper } from '@components';
import { translateRaw } from '@translations';
import { ITxStatus, TxParcel } from '@types';

interface Props {
  currentTxIdx: number;
  transactions: TxParcel[];
  onComplete?(): void;
}

export default function ConfirmTokenMigration({ currentTxIdx, transactions, onComplete }: Props) {
  const status = transactions.map((t) => path(['status'], t));

  const broadcastingIndex = status.findIndex((s) => s === ITxStatus.BROADCASTED);

  const approveTx = {
    title: translateRaw('APPROVE_REP_TOKEN_MIGRATION'),
    icon: step1SVG,
    content: translateRaw('REP_TOKEN_MIGRATION_STEP1_TEXT'),
    buttonText: `${translateRaw('APPROVE_REP_TOKEN_MIGRATION')}`,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  const transferTx = {
    title: translateRaw('COMPLETE_REP_TOKEN_MIGRATION'),
    icon: step2SVG,
    content: translateRaw('REP_TOKEN_MIGRATION_STEP2_TEXT'),
    buttonText: `${translateRaw('CONFIRM_TRANSACTION')}`,
    loading: status[1] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  return (
    <div>
      <VerticalStepper
        currentStep={broadcastingIndex === -1 ? currentTxIdx : broadcastingIndex}
        steps={[approveTx, transferTx]}
      />
    </div>
  );
}
