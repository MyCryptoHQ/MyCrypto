export interface IStepperPath {
  label: string;
  component: any;
  props?: any;
  actions?(payload?: any, cb?: any, cbTwo?: any): any; // cb = goToNextStep; cbTwo = goToPrevStep
}
