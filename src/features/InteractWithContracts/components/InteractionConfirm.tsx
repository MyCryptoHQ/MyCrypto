import { ConfirmTransaction } from '@components';
import { ITxConfig, ITxType } from '@types';

interface Props {
  txConfig: ITxConfig;
  goToNextStep(): void;
}

export default function InteractionConfirm(props: Props) {
  const { goToNextStep, txConfig } = props;

  return (
    <ConfirmTransaction
      onComplete={goToNextStep}
      resetFlow={goToNextStep}
      txConfig={txConfig}
      txType={ITxType.CONTRACT_INTERACT}
    />
  );
}
