import React, { useContext } from 'react';
import styled, { css } from 'styled-components';

import { BannerType } from 'v2/types';
import { Banner } from 'v2/components';
import { BREAK_POINTS, MAX_CONTENT_WIDTH, MIN_CONTENT_PADDING } from 'v2/theme';
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
  padding: 50px ${MIN_CONTENT_PADDING};
  max-width: ${MAX_CONTENT_WIDTH};

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
  const betaAnnouncement =
    'Heads up: this is a beta version of the new MyCrypto. It has not been audited yet, so please practice safe sending.';
  return (
    <SMain className={className}>
      <Header
        drawerVisible={visible}
        toggleDrawerVisible={toggleVisible}
        setDrawerScreen={setScreen}
      />
      <SBanner type={BannerType.ANNOUNCEMENT} value={betaAnnouncement} />
      <SContainer centered={centered} fluid={fluid}>
        {children}
      </SContainer>
      <Footer />
    </SMain>
  );
}
