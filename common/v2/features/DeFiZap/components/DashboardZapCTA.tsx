import React from 'react';
import styled from 'styled-components';

import { DashboardPanel, Typography, RouterLink } from 'v2/components';
import { COLORS } from 'v2/theme';
import { ROUTE_PATHS } from 'v2/config';

import { ZAPS_CONFIG } from '../config';
import ZapCard from './ZapCard';

const CTAContent = styled('ul')`
  display: flex;
  padding: 0px 15px;
  margin: 0px;
`;

const FooterWrapper = styled.div`
  & * {
    color: ${COLORS.BRIGHT_SKY_BLUE};
  }
  & img {
    height: 1.1em;
    margin-right: 0.5em;
  }
`;

const DashboardZapCTA = ({ className }: any) => {
  const zapConfig = ZAPS_CONFIG;
  const headingRight = 'Powered by DefiZap';

  const CTAFooter = () => {
    return (
      <FooterWrapper>
        <RouterLink to={ROUTE_PATHS.DEFIZAP.path}>
          <Typography>{`See All Zaps`}</Typography>
        </RouterLink>
      </FooterWrapper>
    );
  };

  return (
    <DashboardPanel
      heading={'Put your ETH to work for you'}
      headingRight={headingRight}
      className={className}
      footer={<CTAFooter />}
    >
      <CTAContent>
        {Object.values(zapConfig).map(zap => (
          <ZapCard config={zap} key={`key-${zap.key}`} />
        ))}
      </CTAContent>
    </DashboardPanel>
  );
};

export default DashboardZapCTA;
