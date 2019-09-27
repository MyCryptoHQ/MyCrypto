import React, { useContext } from 'react';
import styled, { css } from 'styled-components';

import { BREAK_POINTS, MAX_CONTENT_WIDTH } from 'v2/theme';
import { DrawerContext } from 'v2/features';
import Header from './Header';
import Footer from './Footer';

interface Props {
  className?: string;
  centered?: boolean;
  fluid?: boolean;
  children?: any;
}

const SMain = styled('main')`
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  min-width: 350px;
  background: #f6f8fa;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const SContainer = styled('div')`
  padding: 50px 0;
  max-width: ${MAX_CONTENT_WIDTH};

  // This is the moment our header becomes sticky and shrinks in
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    padding-top: 120px;
  }

  // Necessary to center the mobile layout when below the small screen breakpoint.
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-self: center;
  }

  ${({ centered }: Props) =>
    centered &&
    css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
    `} ${({ fluid }: Props) =>
    fluid &&
    css`
      padding-left: 0;
      padding-right: 0;
    `};
`;

export default function Layout({ centered = true, fluid, className = '', children }: Props) {
  const { visible, toggleVisible, setScreen } = useContext(DrawerContext);

  return (
    <SMain className={className}>
      <Header
        drawerVisible={visible}
        toggleDrawerVisible={toggleVisible}
        setDrawerScreen={setScreen}
      />
      <SContainer centered={centered} fluid={fluid}>
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
