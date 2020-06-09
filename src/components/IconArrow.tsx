import React from 'react';
import styled from 'styled-components';

import CollapseIcon from './icons/CollapseIcon';
import ExpandIcon from './icons/ExpandIcon';
import { IconSize } from './icons/helpers';

interface ArrowProps {
  fillColor?: string;
  size?: IconSize;
  isFlipped?: boolean;
  onClick?(): void;
}

const SIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

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

export const CenteredIconArrow = (props: ArrowProps) => (
  <SIconContainer>
    <IconArrow {...props} />
  </SIconContainer>
);

export default IconArrow;
