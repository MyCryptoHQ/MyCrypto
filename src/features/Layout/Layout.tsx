import React, { useContext, useLayoutEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { Banner } from '@components';
import { DrawerContext, ErrorContext } from '@features';
import { BREAK_POINTS, COLORS, MAX_CONTENT_WIDTH, MIN_CONTENT_PADDING, SPACING } from '@theme';
import translate from '@translations';
import { BannerType } from '@types';

import Footer from './Footer';
import Header from './Header';

export interface LayoutConfig {
  centered?: boolean;
  fluid?: boolean;
  fullW?: boolean;
  marginTop?: number;
  bgColor?: string;
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
    background: ${COLORS.GREY_LIGHTER};
    position: fixed;
    top: 0;
    width: 100%;
    height: 77px;
    z-index: 11;
  }
`;

const SContainer = styled.div`
  padding: ${(p) =>
    `${p.paddingV ? p.paddingV : SPACING.BASE} ${p.fluid || p.fullW ? 0 : MIN_CONTENT_PADDING}`};
  width: 100%;
  max-width: ${(p) => (p.fullW ? '100%' : MAX_CONTENT_WIDTH)};
  /*
  * This is the moment our header becomes sticky and shrinks.
  * Since it is aboslute positionning we move the container down.
  */
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-top: ${(p) => (p.marginTop ? p.marginTop : 0)}px;
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
      /* Necessary to center the mobile layout when below the small screen breakpoint. */
      @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
        align-self: center;
      }
    `}
`;

const BannerWrapper = styled.div`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    position: sticky;
    top: 77px;
    left: 0;
  }
`;

const SBanner = styled(Banner)`
  background-color: ${COLORS.LIGHT_PURPLE};
`;

const CenteredBannerText = styled.div`
  text-align: center;
  & a {
    &:hover {
      font-weight: normal;
    }
  }
`;

export const ANNOUNCEMENT_MSG = () => (
  <CenteredBannerText>{translate('BETA_ANNOUNCEMENT')}</CenteredBannerText>
);

const announcementMessage = ANNOUNCEMENT_MSG();

export default function Layout({ config = {}, className = '', children }: Props) {
  const { centered = true, fluid, fullW = false, bgColor, paddingV } = config;
  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);
  const { error, shouldShowError, getErrorMessage } = useContext(ErrorContext);

  const [topHeight, setTopHeight] = useState(0);

  const topRef = useRef<any>(null);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // Wrap with requestAnimationFrame to avoir loop limit exceeded error
      // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
      window.requestAnimationFrame(() => {
        for (const entry of entries) {
          setTopHeight(entry.contentRect.height);
        }
      });
    });

    resizeObserver.observe(topRef.current);

    return () => resizeObserver.disconnect();
  }, [topRef.current]);

  return (
    <SMain className={className} bgColor={bgColor}>
      <STop>
        {shouldShowError() && error && (
          <Banner type={BannerType.ERROR} value={getErrorMessage(error)} />
        )}

        <Header
          drawerVisible={visible}
          toggleDrawerVisible={toggleVisible}
          setDrawerScreen={setScreen}
        />
      </STop>
      <BannerWrapper ref={topRef}>
        <SBanner type={BannerType.ANNOUNCEMENT} value={announcementMessage} />
      </BannerWrapper>
      <SContainer
        centered={centered}
        fluid={fluid}
        fullW={fullW}
        paddingV={paddingV}
        marginTop={topHeight}
      >
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
