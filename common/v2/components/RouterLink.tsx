import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

interface RouterLinkProps {
  fullWidth?: boolean;
}

const StyledRouterLink =
  styled(Link) <
  RouterLinkProps >
  `
${props =>
    props.fullWidth === true &&
    css`
      width: 100%;
    `}
  
`;

export default StyledRouterLink;
