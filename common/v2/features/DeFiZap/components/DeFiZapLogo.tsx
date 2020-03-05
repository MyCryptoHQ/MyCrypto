import React from 'react';
import styled from 'styled-components';

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
  const headingRight = 'Powered by DefiZap';
  return (
    <DefiZapLogo>
      <DefiZapLogoImage src={defizaplogo} />
      <DefiZapLogoText>{headingRight}</DefiZapLogoText>
    </DefiZapLogo>
  );
};

export default DeFiZapLogo;
