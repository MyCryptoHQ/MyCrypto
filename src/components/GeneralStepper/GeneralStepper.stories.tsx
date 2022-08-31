import { GeneralStepper as GeneralStepperComponent, StepperProps } from './GeneralStepper';

const ExampleButtonComponent = ({ onComplete, onCompleteText }: any) => (
  <>
    <button onClick={() => onComplete(onCompleteText)}>Click Me</button>
  </>
);

const ExampleButtonFinalComponent = ({
  onComplete,
  onCompleteText,
  resetFlow,
  completeButtonText
}: any) => (
  <>
    <button onClick={() => onComplete(onCompleteText)}>Click Me</button>
    <button onClick={() => resetFlow()}>{completeButtonText}</button>
  </>
);

const functionTest = (_: string, cb: any) => {
  cb();
};

export default {
  title: 'Molecules/GeneralStepper',
  component: GeneralStepperComponent
};

const Template = (args: StepperProps) => <GeneralStepperComponent {...args} />;

export const GeneralStepper = Template.bind({});
GeneralStepper.args = {
  steps: [
    {
      label: 'Test Component 1',
      component: ExampleButtonComponent,
      props: { onCompleteText: 'Finished this1' },
      actions: (payload: any, cb: any) => functionTest(payload, cb)
    },
    {
      label: 'Test Component 2',
      component: ExampleButtonFinalComponent,
      props: { onCompleteText: 'Finished this2' }
    }
  ],
  defaultBackPath: '/dashboard',
  defaultBackPathLabel: 'Dashboard',
  completeBtnText: 'Finished'
};
