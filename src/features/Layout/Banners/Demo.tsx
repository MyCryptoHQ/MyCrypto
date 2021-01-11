import styled from 'styled-components';

import { BREAK_POINTS, COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from '@theme';

export const DemoBanner = styled.div`
  background: ${COLORS.WARNING_ORANGE};
  font-weight: bold;
  font-size: ${FONT_SIZE.MD};
  padding: ${LINE_HEIGHT.XXS} ${LINE_HEIGHT.BASE} ${LINE_HEIGHT.BASE} ${LINE_HEIGHT.XXS};
  line-height: ${LINE_HEIGHT.XL};
  color: ${COLORS.WHITE};
  align-items: center;
  text-align: center;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    line-height: ${LINE_HEIGHT.LG};
    font-size: ${FONT_SIZE.SM};
    padding: ${SPACING.NONE} ${SPACING.NONE} ${SPACING.XS} ${SPACING.NONE};
  }
  & a {
    color: ${COLORS.WHITE};
    text-decoration: underline;
    font-weight: normal;
    & :hover {
      color: ${COLORS.WHITE};
      font-weight: normal;
    }
  }
`;
