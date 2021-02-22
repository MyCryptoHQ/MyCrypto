// import React from 'react';

// import { MemoryRouter, Route, Switch } from 'react-router-dom';

// import { GeneralStepper, StepperProps } from './GeneralStepper';

// const ExampleButtonComponent = ({ onComplete, onCompleteText }: any) => (
//   <>
//     <button onClick={() => onComplete(onCompleteText)}>Click Me</button>
//   </>
// );

// const ExampleButtonFinalComponent = ({
//   onComplete,
//   onCompleteText,
//   resetFlow,
//   completeButtonText
// }: any) => (
//   <>
//     <button onClick={() => onComplete(onCompleteText)}>Click Me</button>
//     <button onClick={() => resetFlow()}>{completeButtonText}</button>
//   </>
// );

// const functionTest = (_: string, cb: any) => {
//   cb();
// };

// const props: StepperProps = {
//   steps: [
//     {
//       label: 'Test Component 1',
//       component: ExampleButtonComponent,
//       props: { onCompleteText: 'Finished this1' },
//       actions: (payload: any, cb: any) => functionTest(payload, cb)
//     },
//     {
//       label: 'Test Component 2',
//       component: ExampleButtonFinalComponent,
//       props: { onCompleteText: 'Finished this2' }
//     }
//   ],
//   defaultBackPath: '/dashboard',
//   defaultBackPathLabel: 'Dashboard',
//   completeBtnText: 'Finished'
// };

// export default {
//   title: 'Features/GeneralStepper',
//   component: GeneralStepper
// };

// const Template = (args: StepperProps) => <GeneralStepper {...args} />;

// export const DefaultState = Template.bind({});
// DefaultState.args = props;
