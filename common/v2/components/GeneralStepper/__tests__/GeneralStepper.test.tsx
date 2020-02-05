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

describe('GeneralStepper', () => {
  const StepperComponent = (props: StepperProps, path?: any) => (
    <MemoryRouter initialEntries={path ? [path] : undefined}>
      <GeneralStepper {...props} />
    </MemoryRouter>
  );
  const renderComponent = (props: StepperProps) => simpleRender(<StepperComponent {...props} />);

  test('it renders step 1 correctly first', async () => {
    const { getByText } = renderComponent(defaultProps);
    const text = getByText('Test Component 1'); // The header for step 1
    expect(text).toBeInTheDocument();
  });
  test('it renders step 2 when goToNext is clicked in step 1', async () => {
    const { getByText } = renderComponent(defaultProps);
    const text = getByText('Click Me');
    fireEvent.click(text); // Go to step 2
    const newText = getByText('Test Component 2'); // The header for step 2
    expect(newText).toBeInTheDocument();
  });
  test('it renders step 1 when back button is clicked from step 2', async () => {
    const { getByText } = renderComponent(defaultProps);
    const text = getByText('Click Me');
    fireEvent.click(text); // Go to step 2
    const goBackButton = getByText('Back : Test Component 1'); // The back button when step 2 is rendered
    fireEvent.click(goBackButton);
    const stepOneText = getByText('Test Component 1'); // The header for step 1
    expect(stepOneText).toBeInTheDocument();
  });
});
