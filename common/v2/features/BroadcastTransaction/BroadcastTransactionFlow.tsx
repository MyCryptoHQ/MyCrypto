import React from 'react';

import { GeneralStepper, ConfirmTransaction, TransactionReceipt } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { translateRaw } from 'v2/translations';
import { useStateReducer } from 'v2/utils';
import { IStepperPath } from 'v2/components/GeneralStepper/types';

import { BroadcastTxConfigFactory, broadcastTxInitialState } from './stateFactory';
import { BroadcastTx } from './components';

const BroadcastTransactionFlow = () => {
  const {
    handleNetworkChanged,
    handleSendClicked,
    handleSignedTxChanged,
    handleConfirmClick,
    handleResetFlow,
    broadcastTxState
  } = useStateReducer(BroadcastTxConfigFactory, broadcastTxInitialState);

  const steps: IStepperPath[] = [
    {
      label: translateRaw('BROADCAST_TX_TITLE'),
      component: BroadcastTx,
      props: (({ transaction, signedTransaction, network, networkSelectError }) => ({
        transaction,
        signedTransaction,
        network,
        networkSelectError,
        handleNetworkChanged,
        handleSignedTxChanged: (payload: string) => handleSignedTxChanged(payload)
      }))(broadcastTxState),
      actions: (_: any, cb: any) => handleSendClicked(cb)
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      props: (({ txConfig }) => ({ txConfig }))(broadcastTxState),
      actions: (_: any, cb: any) => handleConfirmClick(cb)
    },
    {
      label: translateRaw('BROADCAST_TX_RECEIPT_TITLE'),
      component: TransactionReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(broadcastTxState),
      actions: (cb: any) => handleResetFlow(cb)
    }
  ];

  return (
    <GeneralStepper
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DASHBOARD.path}
      defaultBackPathLabel={translateRaw('DASHBOARD')}
      completeBtnText={translateRaw('BROADCAST_TX_BROADCAST_ANOTHER')}
    />
  );
};

export default BroadcastTransactionFlow;
