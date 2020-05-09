import React from 'react';
import styled from 'styled-components';

import { DashboardPanel } from '@components';
import { BREAK_POINTS, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { ZAPS_CONFIG } from '../config';
import ZapCard from './ZapCard';
import DeFiZapLogo from './DeFiZapLogo';

const CTAContent = styled.div`
  display: flex;
  padding: 0px ${SPACING.BASE};
  flex-direction: column;
  padding-bottom: ${SPACING.BASE};
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: row;
  }
`;

const DashboardZapCTA = ({ className }: any) => {
  const zapConfig = ZAPS_CONFIG;

  return (
    <DashboardPanel
      heading={translateRaw('ZAP_DASHBOARD_PANEL_HEADER')}
      headingRight={<DeFiZapLogo />}
      className={className}
    >
      <CTAContent>
        {Object.values(zapConfig).map((zap) => (
          <ZapCard config={zap} key={`key-${zap.key}`} />
        ))}
      </CTAContent>
    </DashboardPanel>
  );
};

export default DashboardZapCTA;
