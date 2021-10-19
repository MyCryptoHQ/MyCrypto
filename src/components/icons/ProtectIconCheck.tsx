import { FC } from 'react';

import { COLORS } from '@theme';

interface ProtectIconCheckProps {
  fillColor?: string;
  size?: 'sm' | 'lg';
}

const ProtectIconCheck: FC<ProtectIconCheckProps> = ({ fillColor, size }) => {
  return (
    <svg
      width={(size || 'sm') === 'sm' ? '20' : '73'}
      height={(size || 'sm') === 'sm' ? '23' : '73'}
      viewBox="0 0 73 73"
      fill="none"
    >
      <g clipPath="url(#clip0_7694:115926)">
        <path
          d="M67.3516 9.18888L36.935 0.063875C36.649 -0.0212917 36.3479 -0.0212917 36.062 0.063875L5.64533 9.18888C5.00658 9.3805 4.5625 9.97363 4.5625 10.6458V44.1042C4.5625 57.5544 25.0694 69.5143 36.0498 72.9331C36.1928 72.9787 36.351 73 36.5 73C36.649 73 36.8072 72.9787 36.9471 72.9331C47.9306 69.5143 68.4375 57.5544 68.4375 44.1042V10.6458C68.4375 9.97363 67.9995 9.3805 67.3516 9.18888ZM65.3958 44.1042C65.3958 54.7835 48.475 66.0133 36.5 69.8853C24.525 66.0133 7.60417 54.7835 7.60417 44.1042V11.7773L36.5 3.10858L65.3958 11.7773V44.1042Z"
          strokeWidth={(size || 'sm') === 'sm' ? '5' : '3.5'}
          fill={fillColor || COLORS.PURPLE}
        />
        <path
          d="M23 41L31.6282 49L51.5 25"
          stroke={fillColor || COLORS.PURPLE}
          strokeWidth={(size || 'sm') === 'sm' ? '5' : '3.5'}
          strokeLinecap="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_7694:115926">
          <rect width="73" height="73" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ProtectIconCheck;
