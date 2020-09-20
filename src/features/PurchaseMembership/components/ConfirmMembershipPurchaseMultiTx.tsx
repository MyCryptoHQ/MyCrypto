import React from 'react';

import path from 'ramda/src/path';

import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import { VerticalStepper } from '@components';
import { translateRaw } from '@translations';
import { ITxStatus, TxParcel } from '@types';

import { IMembershipConfig } from '../config';
import MembershipSelectedBanner from './MembershipSelectedBanner';

interface Props {
  membershipSelected: IMembershipConfig;
  currentTxIdx: number;
  transactions: TxParcel[];
  onComplete?(): void;
}

export default function ConfirmMembershipPurchase({
  membershipSelected,
  currentTxIdx,
  transactions,
  onComplete
}: Props) {
  const status = transactions.map((t) => path(['status'], t));

  const broadcastingIndex = status.findIndex((s) => s === ITxStatus.BROADCASTED);

  const approveTx = {
    title: translateRaw('APPROVE_MEMBERSHIP'),
    icon: step1SVG,
    content: translateRaw('MEMBERSHIP_STEP1_TEXT'),
    buttonText: `${translateRaw('APPROVE_MEMBERSHIP')}`,
    loading: status[0] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  const transferTx = {
    title: translateRaw('COMPLETE_PURCHASE'),
    icon: step2SVG,
    content: translateRaw('MEMBERSHIP_STEP2_TEXT'),
    buttonText: `${translateRaw('CONFIRM_TRANSACTION')}`,
    loading: status[1] === ITxStatus.BROADCASTED,
    onClick: onComplete
  };

  return (
    <div>
      <MembershipSelectedBanner membershipSelected={membershipSelected} />
      <VerticalStepper
        currentStep={broadcastingIndex === -1 ? currentTxIdx : broadcastingIndex}
        steps={[approveTx, transferTx]}
      />
    </div>
  );
}
