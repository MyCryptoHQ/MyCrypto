import React, { useState } from 'react';

import { Switch as SwitchComponent } from './Switch';

export default { title: 'Atoms/Switch', component: SwitchComponent };

const Template: React.FC<React.ComponentProps<typeof SwitchComponent>> = (args) => {
  const [state, setState] = useState(false);
  const toggleState = () => setState(!state);
  return <SwitchComponent onChange={toggleState} checked={state} {...args} />;
};

export const Switch = Template.bind({});
Switch.args = {
  labelLeft: 'Off',
  labelRight: 'On',
  $greyable: false
};
