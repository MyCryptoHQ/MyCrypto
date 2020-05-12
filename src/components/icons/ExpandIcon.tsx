import React from 'react';
import { COLORS } from '@theme';

interface Props {
  fillColor?: string;
  size?: 'sm' | 'lg';

  onClick?(e?: React.MouseEvent<SVGSVGElement, MouseEvent>): void;
}

const ExpandIcon: React.FC<Props> = ({ fillColor, size, onClick }) => (
  <svg
    width={(size || 'sm') === 'sm' ? '16' : '32'}
    height={(size || 'sm') === 'sm' ? '16' : '32'}
    viewBox="0 0 32 32"
    fill="none"
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <path
      d="M17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13V15H13C12.4477 15 12 15.4477 12 16C12 16.5523 12.4477 17 13 17H15V19C15 19.5523 15.4477 20 16 20C16.5523 20 17 19.5523 17 19V17H19C19.5523 17 20 16.5523 20 16C20 15.4477 19.5523 15 19 15H17V13Z"
      fill={fillColor || COLORS.BLUE_BRIGHT}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6ZM8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16Z"
      fill={fillColor || COLORS.BLUE_BRIGHT}
    />
  </svg>
);

export default ExpandIcon;
