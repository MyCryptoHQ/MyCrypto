import { FC, MouseEventHandler } from 'react';

import { COLORS } from '@theme';

import { deriveIconSize, IconSize } from './helpers';

interface Props {
  fillColor?: string;
  size?: IconSize;
  onClick?: MouseEventHandler<SVGSVGElement>;
}

const SubtractIcon: FC<Props> = ({ fillColor = COLORS.BLUE_BRIGHT, size, onClick }) => {
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
        fill={fillColor}
        d="M17 15C16 15 16.5523 15 16 15C15.4477 15 16 15 15 15L13 15C12.4477 15 12 15.4477 12 16C12 16.5523 12.4477 17 13 17H15C16 17 15.4477 17 16 17C16.5523 17 16 17 17 17L19 17C19.5523 17 20 16.5523 20 16C20 15.4477 19.5523 15 19 15L17 15Z"
      />
      <path
        fill={fillColor}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 6C10.4772 6 6 10.4772 6 16C6 21.5228 10.4772 26 16 26C21.5228 26 26 21.5228 26 16C26 10.4772 21.5228 6 16 6ZM8 16C8 11.5817 11.5817 8 16 8C20.4183 8 24 11.5817 24 16C24 20.4183 20.4183 24 16 24C11.5817 24 8 20.4183 8 16Z"
      />
    </svg>
  );
};

export default SubtractIcon;
