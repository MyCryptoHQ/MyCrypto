import step2SVG from '@assets/images/icn-receive.svg';
import step1SVG from '@assets/images/icn-send.svg';
import { translateRaw } from '@translations';

export const stepsContent = [
  {
    title: translateRaw('APPROVE_SWAP'),
    icon: step1SVG
  },
  {
    title: translateRaw('COMPLETE_SWAP'),
    icon: step2SVG
  }
];
