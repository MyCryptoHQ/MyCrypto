import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { GeneralStepper, StepperProps } from './GeneralStepper';

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

const props: StepperProps = {
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

const renderComponent = (storyFn: any) => (
  <MemoryRouter>
    <Switch>
      <Route path="*">{storyFn()} </Route>
    </Switch>
  </MemoryRouter>
);

export default {
  title: 'GeneralStepper'
};

export const DefaultState = renderComponent(() => <GeneralStepper {...props} />);
