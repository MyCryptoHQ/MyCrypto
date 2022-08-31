import { FC, MouseEvent } from 'react';

export interface ProtectTxStep {
  component: any;
  props?: any;
  actions?: any;
}

interface Props {
  currentStepIndex: number;
  steps: ProtectTxStep[];
}

export const ProtectTxStepper: FC<Props> = ({ steps, currentStepIndex }) => {
  const { component: Component, props, actions } = steps[currentStepIndex % steps.length];

  return <Component {...props} {...actions} onClick={(e: MouseEvent) => e.stopPropagation()} />;
};
