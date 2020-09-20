import React from 'react';

import styled from 'styled-components';

interface ModalWrapperProps {
  backgroundOpacity?: string;
}

// prettier-ignore
const ModalWrapper = styled.section<ModalWrapperProps>`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, ${props => props.backgroundOpacity || '0.66'});
  z-index: 9999;
  top: 0px;
`;

interface Props {
  children: any;
  backgroundOpacity?: string;
}

export default function Modal({ backgroundOpacity, children }: Props) {
  return <ModalWrapper backgroundOpacity={backgroundOpacity}>{children}</ModalWrapper>;
}
