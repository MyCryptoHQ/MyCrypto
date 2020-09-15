import React from 'react';

import { COLORS } from '@theme';

import { deriveIconSize, IconSize } from './helpers';

interface Props {
  fillColor?: string;
  size?: IconSize;
  onClick?(e?: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
}

const CollapseIcon: React.FC<Props> = ({ fillColor, size, onClick }) => {
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
        d="M25.5293 21.7999C25.0096 22.1313 24.2721 22.0418 23.8823 21.5999L16 12.6667L8.1177 21.5999C7.72786 22.0418 6.99045 22.1313 6.47065 21.7999C5.95086 21.4686 5.84551 20.8418 6.23536 20.3999L15.0588 10.4C15.281 10.1482 15.6297 10 16 10C16.3703 10 16.719 10.1482 16.9412 10.4L25.7646 20.3999C26.1545 20.8418 26.0491 21.4686 25.5293 21.7999Z"
      />
    </svg>
  );
};

export default CollapseIcon;
