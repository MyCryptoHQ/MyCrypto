import styled, { css } from 'styled-components';

interface LinkProps {
  fullWidth?: boolean;
}

const StyledLink =
  styled.a <
  LinkProps >
  `
${props =>
    props.fullWidth === true &&
    css`
      width: 100%;
    `}
  
`;

export default StyledLink;
