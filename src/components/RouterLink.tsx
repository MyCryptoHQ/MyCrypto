import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface RouterLinkProps {
  fullwidth?: boolean;
}

const StyledRouterLink = styled(Link)<RouterLinkProps>`
  ${(props) =>
    props.fullwidth === true &&
    css`
      width: 100%;
    `}
`;

export default StyledRouterLink;
