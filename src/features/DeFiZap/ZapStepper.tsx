import { default as GeneralStepper, IStepperPath } from '@components/GeneralStepper';
import { ROUTE_PATHS } from '@config';
import SignTransaction from '@features/SendAssets/components/SignTransaction';
import { translateRaw } from '@translations';
import { ISignedTx, ISimpleTxFormFull, ITxReceipt } from '@types';
import { useStateReducer } from '@utils';

import ZapConfirm from './components/ZapConfirm';
import ZapForm from './components/ZapForm';
import ZapReceipt from './components/ZapReceipt';
import { IZapConfig } from './config';
import ZapInteractionFactory from './stateFactory';

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

  const steps: IStepperPath[] = [
    {
      label: translateRaw('ZAP_FLOW_ADD_FUNDS'),
      component: ZapForm,
      props: ((state) => state)(zapFlowState),
      actions: (formData: ISimpleTxFormFull, cb: any) => handleUserInputFormSubmit(formData, cb)
    },
    {
      label: translateRaw('CONFIRM_TRANSACTION'),
      component: ZapConfirm,
      props: (({ txConfig, zapSelected }) => ({ txConfig, zapSelected }))(zapFlowState)
    },
    {
      label: '',
      component: SignTransaction,
      props: (({ txConfig }) => ({ txConfig }))(zapFlowState),
      actions: (payload: ITxReceipt | ISignedTx, cb: any) => handleTxSigned(payload, cb)
    },
    {
      label: translateRaw('BROADCAST_TX_RECEIPT_TITLE'),
      component: ZapReceipt,
      props: (({ txConfig, zapSelected, txReceipt }) => ({ txConfig, zapSelected, txReceipt }))(
        zapFlowState
      )
    }
  ];
  return (
    <GeneralStepper
      steps={steps}
      defaultBackPath={ROUTE_PATHS.DEFIZAP.path}
      defaultBackPathLabel={ROUTE_PATHS.DEFIZAP.title}
      completeBtnText={translateRaw('SEND_ASSETS_SEND_ANOTHER')}
    />
  );
};
export default ZapStepper;
