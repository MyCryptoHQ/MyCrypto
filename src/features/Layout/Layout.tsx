import React, { useContext, useLayoutEffect, useRef, useState } from 'react';

import styled from 'styled-components';

import { Banner } from '@components';
import { DrawerContext, ErrorContext, MigrateLS } from '@features';
import { useFeatureFlags } from '@services';
import { StoreContext, useSettings } from '@services/Store';
import { BREAK_POINTS, COLORS, MAX_CONTENT_WIDTH, MIN_CONTENT_PADDING, SPACING } from '@theme';
import { BannerType } from '@types';
import { IS_E2E, withContext, withHook } from '@utils';
import { pipe } from '@vendor';

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

const MigrateLSWithStore = pipe(withContext(StoreContext), withHook(useSettings))(MigrateLS);

export default function Layout({ config = {}, className = '', children }: Props) {
  const { centered = true, fluid, fullW = false, bgColor, paddingV } = config;
  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);
  const { error, shouldShowError, getErrorMessage } = useContext(ErrorContext);
  const { featureFlags } = useFeatureFlags();

  const [topHeight, setTopHeight] = useState(0);

  const topRef = useRef<any>(null);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      // Wrap with requestAnimationFrame to avoir loop limit exceeded error
      // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
      window.requestAnimationFrame(() => {
        for (const entry of entries) setTopHeight(entry.contentRect.height);
      });
    });

    resizeObserver.observe(topRef.current);

    return () => resizeObserver.disconnect();
  }, [topRef.current]);

  return (
    <SMain className={className} bgColor={bgColor}>
      <STop ref={topRef}>
        {!IS_E2E && featureFlags.MIGRATE_LS && <MigrateLSWithStore />}
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
        paddingV={paddingV}
        marginTop={topHeight}
      >
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
