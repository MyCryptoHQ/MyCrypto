import React from 'react';

import { useStateReducer } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config';

import ZapInteractionFactory from './stateFactory';
import {
  DeFiZapEducation,
  ZapSelection,
  ZapForm,
  ConfirmZapInteraction,
  ZapInteractionReceipt
} from './components';
import GeneralStepper from 'v2/components/GeneralStepper/GeneralStepper';
import { IStepperPath } from 'v2/components/GeneralStepper';

const initialZapFlowState = {
  zapSelected: undefined,
  txConfig: undefined,
  txReceipt: undefined
};

export const DeFiZapFlow = () => {
  const { zapFlowState, handleZapSelection } = useStateReducer(
    ZapInteractionFactory,
    initialZapFlowState
  );
  console.debug('[DeFiZapFlow]: Refresh -> ', zapFlowState);

  const steps: IStepperPath[] = [
    {
      label: 'DeFi Zap Education',
      component: DeFiZapEducation
    },
    {
      label: 'Zap Selection',
      component: ZapSelection,
      actions: { handleZapSelection }
    },
    {
      label: 'Zap Form',
      component: ZapForm,
      props: (({ zapSelected }) => ({ zapSelected }))(zapFlowState)
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

export default DeFiZapFlow;
