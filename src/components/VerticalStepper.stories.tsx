import step1SVG from '@assets/images/icn-unlock-wallet.svg';
import { COLORS } from '@theme';

import VerticalStepper from './VerticalStepper';

export default { title: 'Organisms/VerticalStepper', component: VerticalStepper };

export const defaultState = () => (
  <VerticalStepper
    currentStep={1}
    steps={[
      { title: 'Enable ETH', icon: step1SVG, content: 'TEST', buttonText: 'Activate' },
      {
        title: 'Step2',
        icon: step1SVG,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tristique mauris vel blandit vehicula.
          Nam convallis sapien pellentesque sem rutrum, nec lacinia ex placerat. Sed non venenatis turpis.`,
        buttonText: 'Activate'
      },
      { title: 'Step3', icon: step1SVG, content: 'TEST', buttonText: 'Activate' }
    ]}
  />
);

export const largeState = () => (
  <VerticalStepper
    currentStep={-1}
    color={COLORS.PURPLE}
    size="lg"
    steps={[
      { title: 'Step 1', content: 'Step 1 content' },
      { title: 'Step 2', content: 'Step 2 content' },
      { title: 'Step 3', content: 'Step 3 content' }
    ]}
  />
);
