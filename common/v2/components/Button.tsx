import styled, { css } from 'styled-components';
import { Button } from '@mycrypto/ui';

interface ButtonProps {
  fullWidth?: boolean;
}

const StyledButton = styled(Button)<ButtonProps>`
  ${props =>
    props.fullWidth === true &&
    css`
      width: 100%;
      margin-top: 1rem;
    `}
`;

export default StyledButton;
