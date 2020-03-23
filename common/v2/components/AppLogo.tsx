import React from 'react';
import styled from 'styled-components';

import { COLORS } from 'v2/theme';

import mycLogo from 'assets/images/icn-myc.svg';

const Container = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 135px;
  height: 29px;
  border: 1px solid ${COLORS.BLUE_MYC};
  border-radius: 3px;
  font-size: 14px;
  color: ${COLORS.BLUE_MYC};
  font-weight: bold;
`;

export default () => {
  return (
    <Container>
      <img src={mycLogo} width="18px" />
      {'MyCrypto App'}
    </Container>
  );
};
