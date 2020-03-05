import styled from 'styled-components';
import { COLORS } from '../../../theme';

const ProtectedTransactionBase = styled.div`
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
    top: 20px;
    right: 20px;
  }

  h4 {
    margin: 10px 0;
    font-size: 24px;
    line-height: 36px;
  }

  h5 {
    margin: 10px 0 25px;
    font-size: 16px;
    line-height: 24px;
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

export default ProtectedTransactionBase;
