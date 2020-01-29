import React from 'react';
import { useStateReducer } from 'v2/utils';
import { IZapConfig } from './config';
import { ZapForm, ConfirmZapInteraction, ZapInteractionReceipt } from './components';
import { GeneralStepper, IStepperPath } from 'v2/components/GeneralStepper';
import { ROUTE_PATHS } from 'v2/config';
import ZapInteractionFactory from './stateFactory';
import { translateRaw } from 'v2/translations';
import { WALLET_STEPS } from './helpers';
import { ITxReceipt, ISignedTx, WalletId } from 'v2/types';

const initialZapFlowState = (initialZapSelected: IZapConfig) => ({
  zapSelected: initialZapSelected,
  txConfig: undefined,
  txReceipt: undefined
});

interface Props {
  selectedZap: IZapConfig;
}

const ZapStepper = ({ selectedZap }: Props) => {
  const { zapFlowState, handleUserInputFormSubmit, handleTxSigned } = useStateReducer(
    ZapInteractionFactory,
    initialZapFlowState(selectedZap)
  );

  console.debug('[DeFiZapStepper]: Refresh -> ', zapFlowState);

  const steps: IStepperPath[] = [
    {
      label: 'Zap Form',
      component: ZapForm,
      props: (state => state)(zapFlowState),
      actions: { handleUserInputFormSubmit }
    },
    {
      label: 'Confirm Transaction',
      component: ConfirmZapInteraction,
      props: (({ txConfig }) => ({ txConfig }))(zapFlowState)
    },
    {
      label: translateRaw('INTERACT_SIGN_WRITE'),
      component:
        zapFlowState.txConfig &&
        zapFlowState.txConfig.senderAccount &&
        WALLET_STEPS[zapFlowState.txConfig.senderAccount.wallet as WalletId],
      props: (({ rawTransaction }) => ({
        network: zapFlowState.txConfig && zapFlowState.txConfig.network,
        senderAccount: zapFlowState.txConfig.senderAccount,
        rawTransaction
      }))(zapFlowState),
      actions: {
        onSuccess: (payload: ITxReceipt | ISignedTx) => handleTxSigned(payload)
      }
    },
    {
      label: 'Zap Receipt',
      component: ZapInteractionReceipt,
      props: (({ txConfig, txReceipt }) => ({ txConfig, txReceipt }))(zapFlowState)
    }
  ];
  return (
    <GeneralStepper
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DEFIZAP.path}
      defaultBackPathLabel={ROUTE_PATHS.DEFIZAP.title} // ToDo: Change this.
    />
  );
};
export default ZapStepper;
