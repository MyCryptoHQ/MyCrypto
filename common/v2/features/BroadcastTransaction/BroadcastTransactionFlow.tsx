import React, { useState } from 'react';
import EthTx from 'ethereumjs-tx';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import { BroadcastTx, ConfirmTransaction, TransactionReceipt } from './components';
import { ROUTE_PATHS } from 'v2/config';
import { ITxConfig } from '../SendAssets/types';
import { ITxReceipt } from 'v2/types';

const BroadcastTransactionFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [network, setNetwork] = useState('Ethereum');
  const [txReceipt, setTxReceipt] = useState<ITxReceipt | undefined>();
  const [txConfig, setTxConfig] = useState<ITxConfig | undefined>();
  const [signedTransaction, setSignedTransaction] = useState('');
  const [transaction, setTransaction] = useState<EthTx | undefined>();
  const steps = [BroadcastTx, ConfirmTransaction, TransactionReceipt];

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

  const Step = steps[step];

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
    >
      <Step
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
