import React from 'react';
import { COLORS } from '@theme';
import { deriveIconSize, IconSize } from './helpers';

interface Props {
  fillColor?: string;
  size?: IconSize;
  onClick?(e?: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
}

const ExpandIcon: React.FC<Props> = ({ fillColor, size, onClick }) => {
  const iconSize = deriveIconSize(size);
  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 32 32"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
      fill="none"
    >
      <path
        fillRule="evenodd"
        fill={fillColor || COLORS.BLUE_BRIGHT}
        clipRule="evenodd"
        d="M6.47065 10.2001C6.99045 9.86869 7.72786 9.95823 8.1177 10.4001L16 19.3333L23.8823 10.4001C24.2721 9.95823 25.0096 9.86869 25.5293 10.2001C26.0491 10.5314 26.1545 11.1582 25.7646 11.6001L16.9412 21.6C16.719 21.8518 16.3703 22 16 22C15.6297 22 15.281 21.8518 15.0588 21.6L6.23536 11.6001C5.84552 11.1582 5.95086 10.5314 6.47065 10.2001Z"
      />
    </svg>
  );
};

export default ExpandIcon;
