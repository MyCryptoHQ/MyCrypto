import React from 'react';
import { COLORS } from '../../../../theme';

interface CloseIconProps {
  fillColor?: string;
  size?: 'sm' | 'lg';
  onClick?(e?: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
}

const CloseIcon: React.FC<CloseIconProps> = ({ fillColor, size, onClick }) => (
  <svg
    width={(size || 'sm') === 'sm' ? '10' : '20'}
    height={(size || 'sm') === 'sm' ? '11' : '22'}
    viewBox="0 0 20 22"
    fill="none"
    onClick={onClick}
    style={onClick ? { cursor: 'pointer' } : {}}
  >
    <path
      d="M1 1L19 21"
      stroke={fillColor || COLORS.BLUE_LIGHT}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19 1L1 21"
      stroke={fillColor || COLORS.BLUE_LIGHT}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default CloseIcon;
