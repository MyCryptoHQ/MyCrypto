import React from 'react';
import styled from 'styled-components';

import { translateRaw } from '@translations';

import { SPACING } from '@theme';

import enslogo from 'assets/images/ens/ensIcon.svg';

const EnsLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EnsLogoImage = styled.img`
  height: 24px;
`;

const EnsLogoText = styled.div`
  margin-left: ${SPACING.MD};
`;

const EnsLogo = () => {
  return (
    <EnsLogoContainer>
      <EnsLogoImage src={enslogo} />
      <EnsLogoText>{translateRaw('ENS_LOGO_TEXT')}</EnsLogoText>
    </EnsLogoContainer>
  );
};

export default EnsLogo;
