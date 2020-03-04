import React from 'react';
import VerticalStepper from './VerticalStepper';

import step1SVG from 'assets/images/icn-unlock-wallet.svg';

export default { title: 'VerticalStepper' };

export const defaultState = () => (
  <VerticalStepper
    currentStep={1}
    steps={[
      { title: 'Enable ETH', icon: step1SVG, description: 'TEST' },
      {
        title: 'Step2',
        icon: step1SVG,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique mauris vel blandit vehicula. 
          Nam convallis sapien pellentesque sem rutrum, nec lacinia ex placerat. Sed non venenatis turpis.`
      },
      { title: 'Step3', icon: step1SVG, description: 'TEST' }
    ]}
  />
);
