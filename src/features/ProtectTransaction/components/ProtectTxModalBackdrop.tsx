import React, { FC } from 'react';

import styled from 'styled-components';

const ProtectedTransactionModalBackdropLayout = styled.div`
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 998;
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.5);
`;

interface Props {
  onBackdropClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
}

const ProtectTxModalBackdrop: FC<Props> = ({ onBackdropClick }) => {
  return <ProtectedTransactionModalBackdropLayout onClick={onBackdropClick} />;
};

export default ProtectTxModalBackdrop;
