import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.section`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  z-index: 9999;
  top: 0px;
`;

interface Props {
  children: any;
}

export default function Modal({ children }: Props) {
  return <ModalWrapper>{children}</ModalWrapper>;
}
