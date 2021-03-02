import React from 'react';

import CollapseIcon from './icons/CollapseIcon';
import ExpandIcon from './icons/ExpandIcon';
import { IconSize } from './icons/helpers';

interface ArrowProps {
  fillColor?: string;
  size?: IconSize;
  isFlipped?: boolean;
  onClick?(): void;
}

export const IconArrow = ({ isFlipped, fillColor, size, onClick }: ArrowProps) => {
  return (
    <>
      {isFlipped ? (
        <CollapseIcon fillColor={fillColor} size={size} onClick={onClick} />
      ) : (
        <ExpandIcon fillColor={fillColor} size={size} onClick={onClick} />
      )}
    </>
  );
};

export default IconArrow;
