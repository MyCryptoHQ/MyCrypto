import React from 'react';
import styled from 'styled-components';

import chevronIcon from '@assets/images/chevron-right.svg';

const ArrowContainer = styled.img<{ isFlipped?: boolean }>`
  margin-left: 0.5em;
  ${(props) =>
    props.isFlipped &&
    `
      transform: rotateX(180deg);
  `};
`;

interface ArrowProps {
  isFlipped?: boolean;
}

export const IconArrow = ({ isFlipped }: ArrowProps) => {
  return <ArrowContainer src={chevronIcon} isFlipped={isFlipped} />;
};

export default IconArrow;
