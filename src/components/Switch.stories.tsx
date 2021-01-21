import React, { useState } from 'react';

import { Switch } from './Switch';

export default { title: 'Components/Switch' };

const defaultProps = {
  labelLeft: 'Off',
  labelRight: 'On'
};

export const Colored = () => {
  const [state, setState] = useState(false);
  const toggleState = () => setState(!state);
  return <Switch {...defaultProps} checked={state} onChange={toggleState} />;
};

export const Greyable = () => {
  const [state, setState] = useState(false);
  const toggleState = () => setState(!state);
  return <Switch {...defaultProps} checked={state} onChange={toggleState} greyable={true} />;
};
