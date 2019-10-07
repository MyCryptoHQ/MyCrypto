import React, { useState, ReactType } from 'react';
import EthTx from 'ethereumjs-tx';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import { BroadcastTx, ConfirmTransaction, TransactionReceipt } from './components';
import { ROUTE_PATHS, DEFAULT_NETWORK } from 'v2/config';
import { ITxConfig, ITxReceipt } from 'v2/types';
import { translateRaw } from 'translations';

interface TStep {
  title: string;
  component: ReactType;
}

const BroadcastTransactionFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [network, setNetwork] = useState(DEFAULT_NETWORK);
  const [txReceipt, setTxReceipt] = useState<ITxReceipt | undefined>();
  const [txConfig, setTxConfig] = useState<ITxConfig | undefined>();
  const [signedTransaction, setSignedTransaction] = useState('');
  const [transaction, setTransaction] = useState<EthTx | undefined>();

  const steps: TStep[] = [
    { title: translateRaw('BROADCAST_TX_TITLE'), component: BroadcastTx },
    { title: translateRaw('CONFIRM_TX_MODAL_TITLE'), component: ConfirmTransaction },
    { title: translateRaw('BROADCAST_TX_RECEIPT_TITLE'), component: TransactionReceipt }
  ];

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    const { history } = props;
    if (step === 0) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      setStep(step - 1);
    }
  };

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
      heading={stepObject.title}
      centered={true}
    >
      <StepComponent
        goToNextStep={goToNextStep}
        selectNetwork={setNetwork}
        network={network}
        setTransaction={setTransaction}
        transaction={transaction}
        setSignedTransaction={setSignedTransaction}
        signedTransaction={signedTransaction}
        txReceipt={txReceipt}
        setTxReceipt={setTxReceipt}
        txConfig={txConfig}
        setTxConfig={setTxConfig}
        setStep={setStep}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(BroadcastTransactionFlow);
