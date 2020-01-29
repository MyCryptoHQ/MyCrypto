export type TStepAction = (payload: any, after: () => void) => void;

export interface IStepperComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface IStepperPath {
  label: string;
  component: any;
  actions?: any;
  props?: any;
}
