import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { COLORS } from '@theme';

interface RouterLinkProps {
  fullwidth?: boolean;
}

const StyledRouterLink = styled(Link)<RouterLinkProps>`
  &&&& {
    color: ${COLORS.BLUE_SKY};
  }
  ${(props) =>
    props.fullwidth === true &&
    css`
      width: 100%;
    `}
`;

export default StyledRouterLink;
