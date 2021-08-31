import path from 'ramda/src/path';

import { VerticalStepper } from '@components';
import { ITokenMigrationConfig, ITxMultiConfirmProps, ITxStatus } from '@types';

export default function ConfirmTokenMigrationMultiTx({
  currentTxIdx,
  transactions,
  flowConfig,
  onComplete,
  error
}: ITxMultiConfirmProps) {
  const status = transactions.map((t) => path(['status'], t));

  const broadcastingIndex = status.findIndex((s) => s === ITxStatus.BROADCASTED);
  const steps = (flowConfig as ITokenMigrationConfig).txConstructionConfigs.map(
    (txConstructionConfig, index) => ({
      title: txConstructionConfig.stepTitle,
      icon: txConstructionConfig.stepSvg,
      content: txConstructionConfig.stepContent,
      buttonText: txConstructionConfig.actionBtnText,
      loading: status[index] === ITxStatus.BROADCASTED,
      onClick: onComplete
    })
  );

  return (
    <div>
      <VerticalStepper
        currentStep={broadcastingIndex === -1 ? currentTxIdx : broadcastingIndex}
        steps={steps}
        error={error !== undefined}
      />
    </div>
  );
}
