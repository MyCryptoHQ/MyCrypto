import React from 'react';
import styled from 'styled-components';

import { DashboardPanel, LinkOut, Typography } from '@components';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import { Trans, translateRaw } from '@translations';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';

import { ZAPS_CONFIG } from '../config';
import ZapCard from './ZapCard';
import DeFiZapLogo from './DeFiZapLogo';

const CTAContent = styled.div`
  display: flex;
  padding: 0 ${SPACING.BASE};
  flex-direction: column;
  padding-bottom: ${SPACING.BASE};
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    flex-direction: row;
  }
`;

const FooterText = styled(Typography)`
  padding: 0 ${SPACING.BASE} ${SPACING.SM};
  margin-top: -${SPACING.SM};
`;

const SubHeaderText = styled(Typography)`
  padding: 0 ${SPACING.BASE} ${SPACING.SM};
  margin-top: -${SPACING.SM};
  font-size: ${FONT_SIZE.BASE};
`;

const DashboardZapCTA = ({ className }: any) => {
  const zapConfig = ZAPS_CONFIG;

  return (
    <DashboardPanel
      heading={translateRaw('ZAP_DASHBOARD_PANEL_HEADER')}
      headingRight={<DeFiZapLogo />}
      className={className}
    >
      <>
        <SubHeaderText>
          <Trans
            id="ZAP_DASHBOARD_PANEL_SUB_HEADER"
            variables={{
              $readMore: () => (
                <LinkOut
                  showIcon={false}
                  inline={true}
                  fontSize={FONT_SIZE.BASE}
                  fontColor={COLORS.BLUE_BRIGHT}
                  link={getKBHelpArticle(KB_HELP_ARTICLE.HOW_TO_USE_ZAPPER)}
                  text={translateRaw('READ_MORE')}
                />
              )
            }}
          />
        </SubHeaderText>
        <CTAContent>
          {Object.values(zapConfig).map((zap) => (
            <ZapCard config={zap} key={`key-${zap.key}`} />
          ))}
        </CTAContent>
        <FooterText>{translateRaw('ZAP_DASHBOARD_PANEL_FOOTER')}</FooterText>
      </>
    </DashboardPanel>
  );
};

export default DashboardZapCTA;
