import { FC } from 'react';

import styled from 'styled-components';

import { COLORS, FONT_SIZE, SPACING } from '../theme';

const MobileNavBarStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1px -1px 10px;

  > div {
    &.tab {
      position: relative;
      flex-basis: 0;
      flex-grow: 1;
      width: 100%;
      max-width: 100%;

      padding: ${SPACING.BASE} 0;
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
          background-color: ${COLORS.WHITE};
          opacity: 0.15;
        }
      }

      > h6 {
        display: inline-block;
        width: 100%;
        margin: 0;
        text-align: center;
        font-weight: bold;
        font-size: ${FONT_SIZE.SM};
        line-height: ${FONT_SIZE.MD};
        letter-spacing: 1.07692px;
        text-transform: uppercase;
        color: ${COLORS.WHITE};
      }
    }

    &.w-100 {
      width: 100%;
    }
  }
`;

const MobileNavBar: FC = ({ children }) => {
  return <MobileNavBarStyled>{children}</MobileNavBarStyled>;
};

export default MobileNavBar;
