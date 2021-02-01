import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { AnnouncementBanner, Banner, RouterLink } from '@components';
import { ROUTE_PATHS } from '@config';
import { DrawerContext, ErrorContext } from '@features';
import { getAppRoutesObject } from '@routing';
import { useFeatureFlags } from '@services';
import { AppState, getIsDemoMode } from '@store';
import {
  BREAK_POINTS,
  COLORS,
  LINE_HEIGHT,
  MAX_CONTENT_WIDTH,
  MIN_CONTENT_PADDING,
  SPACING
} from '@theme';
import { Trans, translateRaw } from '@translations';
import { BannerType } from '@types';
import { useScreenSize } from '@utils';
import { useTimeoutFn } from '@vendor';

import { DemoBanner } from './Banners';
import Footer from './Footer';
import Header from './Header';
import { DesktopNav, ExtrasTray, MobileNav, TopNav } from './Navigation';

export interface LayoutConfig {
  centered?: boolean;
  fluid?: boolean;
  fullW?: boolean;
  marginTop?: number;
  bgColor?: string;
  paddingV?: string;
}
interface LayoutProps {
  config?: LayoutConfig;
  className?: string;
  children: any;
}

// Homepage 'home' creates an unidentified overflow on the x axis.
// We use layout to disable it here.
const SMain = styled('main')<{ newNav: boolean; bgColor?: string; isDemoMode?: boolean }>`
  ${(p) =>
    p.newNav &&
    css`
      @media screen and (min-width: ${BREAK_POINTS.SCREEN_SM}) {
        margin-left: 6.4vh;
      }
      @media screen and (min-width: ${BREAK_POINTS.SCREEN_XXL}) {
        margin-left: 64px;
      }
      @media only screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
        margin-bottom: 57px;
      }
    `}

  overflow-x: hidden;
  min-width: 350px;
  background: ${(p: { bgColor?: string }) => p.bgColor || '#f6f8fa'};
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const DemoLayoutWrapper = styled.div<{ isDemoMode?: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  ${({ isDemoMode }) =>
    isDemoMode &&
    `
    border: ${LINE_HEIGHT.XXS} solid ${COLORS.WARNING_ORANGE};
    box-sizing: border-box;
  `}
`;

const STop = styled.div<{ newNav: boolean }>`
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    background: ${COLORS.GREY_LIGHTER};
    position: fixed;
    top: 0;
    z-index: 11;
    ${(p) =>
      !p.newNav &&
      css`
        width: 100%;
        height: 77px;
      `}
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

const BannerWrapper = styled.div<{ newNav: boolean }>`
  max-width: 1000px;
  position: sticky;
  top: ${(p) => (p.newNav ? '15px' : '77px')};
  left: 0;
  ${(p) =>
    p.newNav &&
    css`
      margin: 0 15px;
    `}
`;

const Layout = ({ config = {}, className = '', children, isDemoMode }: Props) => {
  const { centered = true, fluid, fullW = false, bgColor, paddingV } = config;
  const { featureFlags, isFeatureActive } = useFeatureFlags();
  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);
  const { error, shouldShowError, getErrorMessage } = useContext(ErrorContext);
  const { isMobile } = useScreenSize();
  const { pathname } = useLocation();

  const [topHeight, setTopHeight] = useState(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isReady, clear, set] = useTimeoutFn(() => setIsOpen(!isOpen), 100);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const topRef = useRef<any>(null);

  useEffect(() => clear());

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

  const APP_ROUTES = getAppRoutesObject(featureFlags);
  return (
    <>
      {isFeatureActive('NEW_NAVIGATION') && isMobile && (
        <MobileNav appRoutes={APP_ROUTES} current={pathname} />
      )}
      {isFeatureActive('NEW_NAVIGATION') && !isMobile && (
        <DesktopNav
          appRoutes={APP_ROUTES}
          current={pathname}
          openTray={() => isReady() !== false && set()}
        />
      )}
      {isFeatureActive('NEW_NAVIGATION') && !isMobile && isOpen && (
        <ExtrasTray isMobile={isMobile} closeTray={() => isReady() !== false && set()} />
      )}
      <SMain className={className} bgColor={bgColor} newNav={isFeatureActive('NEW_NAVIGATION')}>
        <STop newNav={isFeatureActive('NEW_NAVIGATION')} ref={topRef}>
          {shouldShowError() && error && (
            <Banner type={BannerType.ERROR} value={getErrorMessage(error)} />
          )}

          {isFeatureActive('OLD_NAVIGATION') && (
            <Header
              drawerVisible={visible}
              toggleDrawerVisible={toggleVisible}
              setDrawerScreen={setScreen}
            />
          )}
        </STop>
        {isFeatureActive('NEW_NAVIGATION') && isMobile && isOpen ? (
          <>
            <ExtrasTray isMobile={isMobile} closeTray={() => setIsOpen(false)} />
            {isFeatureActive('NEW_NAVIGATION') && (
              <TopNav
                current={pathname}
                isMobile={isMobile}
                isTrayOpen={isOpen}
                openTray={() => setIsOpen(!isOpen)}
              />
            )}
          </>
        ) : (
          <DemoLayoutWrapper isDemoMode={isDemoMode}>
            {isDemoMode && (
              <DemoBanner>
                <Trans
                  id="DEMO_BANNER"
                  variables={{
                    $link: () => (
                      <RouterLink to={ROUTE_PATHS.ADD_ACCOUNT.path}>
                        {translateRaw('DEMO_BANNER_LINK_TEXT')}
                      </RouterLink>
                    )
                  }}
                />
              </DemoBanner>
            )}
            {isFeatureActive('NEW_NAVIGATION') && (
              <TopNav
                current={pathname}
                isMobile={isMobile}
                isTrayOpen={isOpen}
                openTray={() => setIsOpen(!isOpen)}
              />
            )}
            {isMobile && pathname === ROUTE_PATHS.DASHBOARD.path && (
              <BannerWrapper newNav={isFeatureActive('NEW_NAVIGATION')}>
                <AnnouncementBanner />
              </BannerWrapper>
            )}
            <SContainer
              centered={centered}
              fluid={fluid}
              fullW={fullW}
              paddingV={paddingV}
              marginTop={isFeatureActive('OLD_NAVIGATION') ? topHeight : 0}
            >
              {children}
            </SContainer>
            {isFeatureActive('OLD_NAVIGATION') && <Footer />}
          </DemoLayoutWrapper>
        )}
      </SMain>
    </>
  );
};

const mapStateToProps = (state: AppState) => ({
  isDemoMode: getIsDemoMode(state)
});

const connector = connect(mapStateToProps);
type Props = ConnectedProps<typeof connector> & LayoutProps;

export default connector(Layout);
