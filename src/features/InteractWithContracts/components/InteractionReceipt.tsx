import { TxReceipt } from '@components/TransactionFlow';
import { translateRaw } from '@translations';
import { ITxConfig, ITxReceipt } from '@types';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function InteractionReceipt(props: Props) {
  const { txReceipt, txConfig, goToFirstStep, ...rest } = props;

  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButton={translateRaw('INTERACT_ANOTHER')}
      resetFlow={goToFirstStep}
      onComplete={goToFirstStep}
      {...rest}
    />
  );
}
