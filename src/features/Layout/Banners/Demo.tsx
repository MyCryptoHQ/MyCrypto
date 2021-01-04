import styled from 'styled-components';

import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';

export const DemoBanner = styled.div`
  position: absolute;
  background: ${COLORS.WARNING_ORANGE};
  & p {
    font-weight: bold;
    font-size: ${FONT_SIZE.MD};
    margin: ${LINE_HEIGHT.XXS} ${LINE_HEIGHT.BASE} ${LINE_HEIGHT.BASE} ${LINE_HEIGHT.XXS};
    line-height: ${LINE_HEIGHT.XL};
    color: ${COLORS.WHITE};
    align-items: center;
    text-align: center;

    @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
      line-height: ${LINE_HEIGHT.SM};
      font-size: ${FONT_SIZE.SM};
      margin: ${SPACING.NONE} ${SPACING.XS} ${SPACING.XS} ${SPACING.NONE};
    }
  }
`;
