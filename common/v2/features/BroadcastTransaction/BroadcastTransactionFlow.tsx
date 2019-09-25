import React, { useState } from 'react';
import EthTx from 'ethereumjs-tx';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import { BroadcastTx, ConfirmTransaction } from './components';
import { ROUTE_PATHS } from 'v2/config';

const BroadcastTransactionFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [network, setNetwork] = useState('Ethereum');
  const [signedTransaction, setSignedTransaction] = useState('');
  const [transaction, setTransaction] = useState<EthTx | undefined>(undefined);
  const steps = [BroadcastTx, ConfirmTransaction];

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
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(BroadcastTransactionFlow);
