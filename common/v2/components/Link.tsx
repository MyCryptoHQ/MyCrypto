import styled, { css } from 'styled-components';

interface LinkProps {
  fullwidth?: boolean;
}

const StyledLink = styled.a<LinkProps>`
  ${props =>
    props.fullwidth === true &&
    css`
      width: 100%;
    `}
`;

export default StyledLink;
