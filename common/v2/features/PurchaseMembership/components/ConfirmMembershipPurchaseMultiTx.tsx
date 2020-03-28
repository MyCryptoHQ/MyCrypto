import React from 'react';
import * as R from 'ramda';

import { ITxConfig, ITxStatus, TxParcel } from 'v2/types';
import { IMembershipConfig } from '../config';
import { Typography, VerticalStepper } from 'v2/components';
import { translateRaw } from 'v2/translations';

import step1SVG from 'assets/images/icn-send.svg';
import step2SVG from 'assets/images/icn-receive.svg';

interface Props {
  membershipSelected: IMembershipConfig;
  txConfig: ITxConfig;
  currentTxIdx: number;
  transactions: TxParcel[];
  onClick?(): void;
}

export default function ConfirmMembershipPurchase({ currentTxIdx, transactions, onClick }: Props) {
  const status = transactions.map(t => R.path(['status'], t));

  const broadcasting = status.findIndex(s => s === ITxStatus.BROADCASTED);

  const approveTx = {
    title: translateRaw('APPROVE_SWAP'),
    icon: step1SVG,
    content: translateRaw('SWAP_STEP1_TEXT'),
    buttonText: `${translateRaw('APPROVE_SWAP')}`,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick
  };

  const transferTx = {
    title: translateRaw('COMPLETE_SWAP'),
    icon: step2SVG,
    content: translateRaw('SWAP_STEP2_TEXT'),
    buttonText: `${translateRaw('CONFIRM_TRANSACTION')}`,
    loading: status[1] === ITxStatus.BROADCASTED,
    onClick
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
