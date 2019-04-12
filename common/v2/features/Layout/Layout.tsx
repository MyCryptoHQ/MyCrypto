import React from 'react';
import styled, { css } from 'styled-components';

import { DrawerProvider, DrawerContext } from 'v2/providers';
import Header from './Header';
import Footer from './Footer';

interface Props {
  centered?: boolean;
  fluid?: boolean;
  children?: any;
}

interface LayoutProps {
  centered?: boolean;
  fluid?: boolean;
}

const LayoutContainer = styled.main`
  min-width: 350px;
  background: #f6f8fa;
`;

const LayoutContent =
  styled.div <
  LayoutProps >
  `
  padding: 100px 0 50px 0;

  @media (min-width: 700px) {
    padding: 150px 80px 50px 80px;
    ${props =>
      props.centered &&
      css`
        display: flex;
        align-items: center;
        justify-content: center;
      `}
  }
  @media (min-width: 1000px) {
    padding: 50px 80px;
    ${props =>
      props.fluid &&
      css`
        padding-left: 0;
        padding-right: 0;
      `}
  }
`;

export default function Layout({ centered, fluid, children }: Props) {
  return (
    <DrawerProvider>
      <LayoutContainer>
        <DrawerContext.Consumer>
          {({ visible, toggleVisible, setScreen }) => (
            <Header
              drawerVisible={visible}
              toggleDrawerVisible={toggleVisible}
              setDrawerScreen={setScreen}
            />
          )}
        </DrawerContext.Consumer>
        <LayoutContent centered={centered} fluid={fluid}>
          {children}
        </LayoutContent>
        <Footer />
      </LayoutContainer>
    </DrawerProvider>
  );
}
