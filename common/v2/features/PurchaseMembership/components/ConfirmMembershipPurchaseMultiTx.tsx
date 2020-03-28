import React from 'react';
import * as R from 'ramda';

import { ITxStatus, TxParcel } from 'v2/types';
import { IMembershipConfig } from '../config';
import { Typography, VerticalStepper } from 'v2/components';
import { translateRaw } from 'v2/translations';

import step1SVG from 'assets/images/icn-send.svg';
import step2SVG from 'assets/images/icn-receive.svg';

interface Props {
  membershipSelected: IMembershipConfig;
  currentTxIdx: number;
  transactions: TxParcel[];
  onComplete?(): void;
}

export default function ConfirmMembershipPurchase({
  currentTxIdx,
  transactions,
  onComplete
}: Props) {
  const status = transactions.map(t => R.path(['status'], t));

  const broadcasting = status.findIndex(s => s === ITxStatus.BROADCASTED);

  const approveTx = {
    title: translateRaw('APPROVE_SWAP'),
    icon: step1SVG,
    content: translateRaw('SWAP_STEP1_TEXT'),
    buttonText: `${translateRaw('APPROVE_SWAP')}`,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  const transferTx = {
    title: translateRaw('COMPLETE_SWAP'),
    icon: step2SVG,
    content: translateRaw('SWAP_STEP2_TEXT'),
    buttonText: `${translateRaw('CONFIRM_TRANSACTION')}`,
    loading: status[1] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  return (
    <div>
      <Typography as="p" style={{ marginBottom: '2em' }}>
        {translateRaw('SWAP_INTRO')}
      </Typography>
      <VerticalStepper
        currentStep={broadcasting === -1 ? currentTxIdx : broadcasting}
        steps={[approveTx, transferTx]}
      />
    </div>
  );
}
