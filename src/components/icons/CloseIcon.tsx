import { FC, MouseEventHandler } from 'react';

import { COLORS } from '@theme';

interface CloseIconProps {
  fillColor?: string;
  size?: 'sm' | 'lg' | 'md';
  onClick?: MouseEventHandler<SVGSVGElement>;
}

const CloseIcon: FC<CloseIconProps> = ({ fillColor = COLORS.BLUE_SKY, size = 'sm', onClick }) => {
  const dimensions = (s: string) => {
    switch (s) {
      case 'sm':
      default:
        return { width: '10', height: '11' };
      case 'md':
        return { width: '18', height: '18' };
      case 'lg':
        return { width: '20', height: '22' };
    }
  };
  return (
    <svg
      className="close-icon"
      width={dimensions(size).width}
      height={dimensions(size).height}
      viewBox="0 0 20 22"
      fill="none"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <path d="M1 1L19 21" stroke={fillColor} strokeWidth="2" strokeLinecap="round" />
      <path d="M19 1L1 21" stroke={fillColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export default CloseIcon;
