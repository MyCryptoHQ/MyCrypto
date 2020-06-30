import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { BannerType } from '@types';
import { Banner } from '@components';
import { BREAK_POINTS, MAX_CONTENT_WIDTH, MIN_CONTENT_PADDING, SPACING } from '@theme';
import { DrawerContext, ErrorContext } from '@features';
import Header from './Header';
import Footer from './Footer';

export interface LayoutConfig {
  centered?: boolean;
  fluid?: boolean;
  fullW?: boolean;
  bgColor?: string;
  marginTop?: string;
  paddingV?: string;
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

const STop = styled.div`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 999;
  }
`;

const SContainer = styled('div')`
  padding: ${(p) =>
    `${p.paddingV ? p.paddingV : SPACING.BASE} ${p.fluid || p.fullW ? 0 : MIN_CONTENT_PADDING}`};
  width: 100%;
  max-width: ${(p) => (p.fullW ? '100%' : MAX_CONTENT_WIDTH)};
  /*
  * This is the moment our header becomes sticky and shrinks.
  * Since it is aboslute positionning we move the container down.
  */
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: ${(p) => (p.marginTop ? p.marginTop : 0)};
    padding: ${(p) =>
      `${p.paddingV ? p.paddingV : SPACING.BASE} ${p.fluid || p.fullW ? 0 : MIN_CONTENT_PADDING}`};
  }

  ${({ centered }: LayoutConfig) =>
    centered &&
    `
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      // Necessary to center the mobile layout when below the small screen breakpoint.
      @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
        align-self: center;
      }
    `}
`;

export default function Layout({ config = {}, className = '', children }: Props) {
  const { centered = true, fluid, fullW = false, bgColor, paddingV } = config;
  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);
  const { error, shouldShowError, getErrorMessage } = useContext(ErrorContext);

  // Store the calculated height of STop so we can adapt the marginTop of SContainer
  // when the mobile header has a fixed positioning.
  const [topWidth, setTopWidth] = useState('0px');

  return (
    <SMain className={className} bgColor={bgColor}>
      <STop ref={(elem: any) => elem && setTopWidth(`${elem.getBoundingClientRect().height}px`)}>
        {shouldShowError() && error && (
          <Banner type={BannerType.ERROR} value={getErrorMessage(error)} />
        )}

        <Header
          drawerVisible={visible}
          toggleDrawerVisible={toggleVisible}
          setDrawerScreen={setScreen}
        />
      </STop>
      <SContainer
        centered={centered}
        fluid={fluid}
        fullW={fullW}
        marginTop={topWidth}
        paddingV={paddingV}
      >
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
