import React, { useContext } from 'react';
import styled, { css } from 'styled-components';

import { BREAK_POINTS, MAX_CONTENT_WIDTH, MIN_CONTENT_PADDING } from 'v2/theme';
import { DrawerContext } from 'v2/features';
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

const SContainer = styled('div')`
  padding: 50px ${p => (p.fluid || p.fullW ? 0 : MIN_CONTENT_PADDING)};
  max-width: ${p => (p.fullW ? '100%' : MAX_CONTENT_WIDTH)};

  // This is the moment our header becomes sticky and shrinks.
  // Since it is aboslute positionning we add the extra height to
  // the padding.
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    padding-top: 120px;
  }

  ${({ centered }: LayoutConfig) =>
    centered &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
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

  return (
    <SMain className={className} bgColor={bgColor}>
      <Header
        drawerVisible={visible}
        toggleDrawerVisible={toggleVisible}
        setDrawerScreen={setScreen}
      />
      <SContainer centered={centered} fluid={fluid} fullW={fullW}>
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
