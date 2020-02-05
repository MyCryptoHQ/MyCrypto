import React from 'react';

import { simpleRender, fireEvent } from 'test-utils';

import GeneralStepper, { StepperProps } from '../GeneralStepper';
import { MemoryRouter } from 'react-router-dom';

const ExampleButtonComponent = ({ onComplete, onCompleteText }: any) => {
  return (
    <>
      <button onClick={onComplete(onCompleteText)}>Click Me</button>
    </>
  );
};

const functionTest = (textTriggered: string, cb: any) => {
  console.debug('textTriggered: ', textTriggered);
  cb();
};
const testSteps = [
  {
    label: 'Test Component 1',
    component: ExampleButtonComponent,
    props: { onCompleteText: 'Finished this1' },
    actions: (payload: any, cb: any) => functionTest(payload, cb)
  },
  {
    label: 'Test Component 2',
    component: ExampleButtonComponent,
    props: { onCompleteText: 'Finished this2' },
    actions: (payload: any, cb: any) => functionTest(payload, cb)
  }
];

const defaultBackPath = '/dashboard';
const defaultBackPathLabel = 'Dashboard';
const completeBtnText = 'Finished';

const defaultProps: StepperProps = {
  steps: testSteps,
  defaultBackPath,
  defaultBackPathLabel,
  completeBtnText
};

const StepperComponent = (props: StepperProps, path?: any) => (
  <MemoryRouter initialEntries={path ? [path] : undefined}>
    <GeneralStepper {...props} />
  </MemoryRouter>
);

function getComponent(props: StepperProps) {
  return simpleRender(<StepperComponent {...props} />);
}

describe('GeneralStepper', () => {
  test('it renders the steps correctly with the continue on button rendered.', async () => {
    const { getByText } = getComponent(defaultProps);
    const text = getByText('Test Component 1');
    expect(text).toBeInTheDocument();
  });
  test('it renders step two when goToNext is clicked', async () => {
    const { getByText } = getComponent(defaultProps);
    const text = getByText('Click Me');
    fireEvent.click(text);
    const newText = getByText('Test Component 2');
    expect(newText).toBeInTheDocument();
  });
  test('it renders step 1 when goBack is clicked from step 2', async () => {
    const { getByText } = getComponent(defaultProps);
    const text = getByText('Click Me');
    fireEvent.click(text);
    const goBackButton = getByText('Back : Test Component 1');
    fireEvent.click(goBackButton);
    const stepOneText = getByText('Test Component 1');
    expect(stepOneText).toBeInTheDocument();
  });
});
