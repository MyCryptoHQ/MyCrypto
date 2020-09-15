import React from 'react';

import { COLORS } from '@theme';

interface ArrowRightIconProps {
  fillColor?: string;
  size?: 'sm' | 'lg';
}

const ArrowRightIcon: React.FC<ArrowRightIconProps> = ({ fillColor, size }) => (
  <svg
    width={(size || 'sm') === 'sm' ? '7' : '14'}
    height={(size || 'sm') === 'sm' ? '11' : '22'}
    viewBox="0 0 7 11"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.541653 9.61329L1.92837 11L6.70697 6.2214L1.48437 0.998794L0.0976559 2.38551L3.93355 6.2214L0.541653 9.61329Z"
      fill={fillColor || COLORS.PURPLE}
    />
  </svg>
);

export default ArrowRightIcon;
