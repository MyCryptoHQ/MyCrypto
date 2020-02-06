export type TStepAction = (payload: any, after: () => void) => void;

export interface IStepperComponentProps {
  completeButtonText: string;
  resetFlow(): void;
  onComplete(payload?: any): void;
}

export interface IStepperPath {
  label: string;
  component: any;
  props?: any;
  actions?(payload?: any, cb?: any, cbTwo?: any): any; // cb = goToNextStep; cbTwo = goToPrevStep
}
