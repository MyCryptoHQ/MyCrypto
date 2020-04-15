import React, { FC } from 'react';
import styled from 'styled-components';

import { BREAK_POINTS, COLORS } from './theme';
import { IS_MOBILE } from './utils';

const MobileNavBarStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: -19px 0 0;

  > div {
    &.tab {
      position: relative;
      flex-basis: 0;
      flex-grow: 1;
      width: 100%;
      max-width: 100%;

      padding: 23px 0;
      background-color: ${COLORS.BLUE_DARK_SLATE};
      border: 1px solid ${COLORS.GREY_GEYSER};

      &.active {
        &:after {
          content: ' ';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          opacity: 0.15;
        }
      }

      > h6 {
        display: inline-block;
        width: 100%;
        margin: 0;
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        line-height: 17px;
        letter-spacing: 1.07692px;
        text-transform: uppercase;
        color: ${COLORS.WHITE};
      }
    }

    &.w-100 {
      width: 100%;
    }
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    margin-top: ${IS_MOBILE && '-29px'};
  }
`;

const MobileNavBar: FC = ({ children }) => {
  return <MobileNavBarStyled>{children}</MobileNavBarStyled>;
};

export default MobileNavBar;
