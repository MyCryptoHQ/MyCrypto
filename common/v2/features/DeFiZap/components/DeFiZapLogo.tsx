import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';

import defizaplogo from 'assets/images/defizap/defizaplogo.svg';

const DefiZapLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DefiZapLogoImage = styled.img`
  height: 24px;
`;

const DefiZapLogoText = styled.div`
  margin-left: 0.5em;
`;

const DeFiZapLogo = () => {
  return (
    <DefiZapLogo>
      <DefiZapLogoImage src={defizaplogo} />
      <DefiZapLogoText>{translateRaw('ZAP_POWERED_BY')}</DefiZapLogoText>
    </DefiZapLogo>
  );
};

export default DeFiZapLogo;
