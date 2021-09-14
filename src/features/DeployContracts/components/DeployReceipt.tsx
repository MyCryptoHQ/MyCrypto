import { TxReceipt } from '@components/TransactionFlow';
import { translateRaw } from '@translations';
import { ITxConfig, ITxReceipt } from '@types';

interface Props {
  txReceipt: ITxReceipt;
  txConfig: ITxConfig;
  goToFirstStep(): void;
}

export default function DeployReceipt(props: Props) {
  const { txReceipt, txConfig, goToFirstStep, ...rest } = props;

  return (
    <TxReceipt
      txReceipt={txReceipt}
      txConfig={txConfig}
      completeButton={translateRaw('DEPLOY_ANOTHER')}
      resetFlow={goToFirstStep}
      onComplete={goToFirstStep}
      {...rest}
    />
  );
}
