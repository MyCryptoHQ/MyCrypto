import path from 'ramda/src/path';

import { VerticalStepper } from '@components';
import { ITxMultiConfirmProps, ITxStatus } from '@types';

import { IMembershipConfig, stepsContent } from '../config';
import MembershipSelectedBanner from './MembershipSelectedBanner';

export default function ConfirmMembershipPurchase({
  flowConfig,
  currentTxIdx,
  transactions,
  onComplete,
  error
}: ITxMultiConfirmProps) {
  const status = transactions.map((t) => path(['status'], t));

  const broadcastingIndex = status.findIndex((s) => s === ITxStatus.BROADCASTED);

  const steps = stepsContent.map((step, idx) => ({
    ...step,
    loading: status[idx] === ITxStatus.BROADCASTED,
    onClick: onComplete
  }));

  return (
    <div>
      <MembershipSelectedBanner membershipSelected={flowConfig as IMembershipConfig} />
      <VerticalStepper
        currentStep={broadcastingIndex === -1 ? currentTxIdx : broadcastingIndex}
        steps={steps}
        error={error !== undefined}
      />
    </div>
  );
}
