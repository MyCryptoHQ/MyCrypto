import styled from 'styled-components';
import { COLORS, FONT_SIZE, LINE_HEIGHT, SPACING } from 'v2/theme';

const ProtectTxBase = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  border-radius: 2px;
  background: ${COLORS.WHITE};
  text-align: center;

  svg.close-icon {
    position: absolute;
    top: ${SPACING.BASE};
    right: ${SPACING.BASE};
  }

  h4 {
    margin: ${SPACING.SM} 0;
    font-size: ${FONT_SIZE.XL};
    line-height: ${LINE_HEIGHT.XXL};
  }

  h5 {
    margin: ${SPACING.SM} 0 25px;
    font-size: ${FONT_SIZE.BASE};
    line-height: ${LINE_HEIGHT.XL};
  }

  hr {
    width: 100%;
    margin: 0 0 18px 0;
    border: 1px solid ${COLORS.GREY_LIGHTER};
  }

  .muted {
    color: ${COLORS.BLUE_GREY};
  }
`;

export default ProtectTxBase;
