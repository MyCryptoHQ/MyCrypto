import React from 'react';
import { useStateReducer } from 'v2/utils';
import { IZapConfig } from './config';
import { ZapForm, ConfirmZapInteraction, ZapInteractionReceipt } from './components';
import { GeneralStepper, IStepperPath } from 'v2/components/GeneralStepper';
import { ROUTE_PATHS } from 'v2/config';
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
  const { zapFlowState } = useStateReducer(ZapInteractionFactory, initialZapFlowState(selectedZap));

  console.debug('[DeFiZapFlow]: Refresh -> ', zapFlowState);

  const steps: IStepperPath[] = [
    {
      label: 'Zap Form',
      component: ZapForm,
      props: (state => state)(zapFlowState)
    },
    {
      label: 'Confirm Transaction',
      component: ConfirmZapInteraction,
      props: (({ txConfig }) => ({ txConfig }))(zapFlowState)
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
