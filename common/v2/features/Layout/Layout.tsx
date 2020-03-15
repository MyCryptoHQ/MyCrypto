import React, { useContext } from 'react';
import styled from 'styled-components';

import { BannerType } from 'v2/types';
import { Banner } from 'v2/components';
import { BREAK_POINTS, MAX_CONTENT_WIDTH, MIN_CONTENT_PADDING, SPACING } from 'v2/theme';
import { DrawerContext, ErrorContext } from 'v2/features';
import Header from './Header';
import Footer from './Footer';

interface LayoutConfig {
  centered?: boolean;
  fluid?: boolean;
  fullW?: boolean;
  bgColor?: string;
}
interface Props {
  config?: LayoutConfig;
  className?: string;
  children: any;
}

// Homepage 'home' creates an unidentified overflow on the x axis.
// We use layout to disable it here.
const SMain = styled('main')`
  overflow-x: hidden;
  min-width: 350px;
  background: ${(p: { bgColor?: string }) => p.bgColor || '#f6f8fa'};
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

// This is the moment our header becomes sticky and shrinks.
// Since it is aboslute positionning we add the extra height to
// the padding.
// !WARNING: When we remove the banner we will need to place the
// same margin on SContainer.
const SBanner = styled(Banner)`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: 77px;
  }
`;

const SContainer = styled('div')`
  padding: ${SPACING.BASE};
  width: 100%;
  max-width: ${p => (p.fullW ? '100%' : MAX_CONTENT_WIDTH)};

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    padding: ${SPACING.MD} ${p => (p.fluid || p.fullW ? 0 : MIN_CONTENT_PADDING)};
  }

  ${({ centered }: LayoutConfig) =>
    centered &&
    `
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      // Necessary to center the mobile layout when below the small screen breakpoint.
      @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
        align-self: center;
      }
    `}
`;

export default function Layout({ config = {}, className = '', children }: Props) {
  const { centered = true, fluid, fullW = false, bgColor } = config;
  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);
  const { error, shouldShowError, getErrorMessage } = useContext(ErrorContext);
  const betaAnnouncement =
    'Heads up: this is a beta version of the new MyCrypto. It has not been audited yet, so please practice safe sending.';
  return (
    <SMain className={className} bgColor={bgColor}>
      <Header
        drawerVisible={visible}
        toggleDrawerVisible={toggleVisible}
        setDrawerScreen={setScreen}
      />
      {shouldShowError() && error && (
        <SBanner type={BannerType.ERROR} value={getErrorMessage(error)} />
      )}
      <SBanner type={BannerType.ANNOUNCEMENT} value={betaAnnouncement} />
      <SContainer centered={centered} fluid={fluid} fullW={fullW}>
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
