import React, { FC } from 'react';
import styled from 'styled-components';

const ProtectedTransactionModalBackdropLayout = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.5);
`;

interface Props {
  onBackdropClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const ProtectTxModalBackdrop: FC<Props> = ({ onBackdropClick }) => {
  return <ProtectedTransactionModalBackdropLayout onClick={onBackdropClick} />;
};

export default ProtectTxModalBackdrop;
