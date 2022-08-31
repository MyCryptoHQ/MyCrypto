import { ConfirmTransaction, GeneralStepper, TxReceipt } from '@components';
import { IStepperPath } from '@components/GeneralStepper/types';
import { ROUTE_PATHS } from '@config';
import { translateRaw } from '@translations';
import { ISignedTx } from '@types';
import { useStateReducer } from '@utils';

import { BroadcastTx } from './components';
import { BroadcastTxConfigFactory, broadcastTxInitialState } from './stateFactory';

const BroadcastTransactionFlow = () => {
  const {
    handleNetworkChanged,
    handleSendClicked,
    handleConfirmClick,
    handleResetFlow,
    broadcastTxState
  } = useStateReducer(BroadcastTxConfigFactory, broadcastTxInitialState);

  const steps: IStepperPath[] = [
    {
      label: translateRaw('BROADCAST_TX_TITLE'),
      component: BroadcastTx,
      props: (({ signedTx, network: networkId }) => ({
        signedTx,
        networkId,
        handleNetworkChanged
      }))(broadcastTxState),
      actions: (signedTx: ISignedTx, cb: any) => handleSendClicked(signedTx, cb)
    },
    {
      label: translateRaw('CONFIRM_TX_MODAL_TITLE'),
      component: ConfirmTransaction,
      props: (({ txConfig, error }) => ({ txConfig, error }))(broadcastTxState),
      actions: (_: any, cb: any) => handleConfirmClick(cb)
    },
    {
      label: translateRaw('BROADCAST_TX_RECEIPT_TITLE'),
      component: TxReceipt,
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
