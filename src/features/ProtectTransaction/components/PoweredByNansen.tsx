import React from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';

import nansenLogo from '@assets/images/credits/credits-nansen.svg';
import { SPACING } from '@theme';
import { Typography } from '@components';

const Wrapper = styled.div`
  position: absolute;
  bottom: ${SPACING.BASE};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 24px;
`;

const PoweredByText = styled(Typography)`
  margin-right: ${SPACING.XS};
`;

const PoweredByNansen = () => {
  return (
    <Wrapper>
      <PoweredByText fontSize="12px">{translateRaw('POWERED_BY')}</PoweredByText>
      <Logo src={nansenLogo} />
    </Wrapper>
  );
};
export default PoweredByNansen;
