import styled, { css } from 'styled-components';
import { Button } from '@mycrypto/ui';

interface ButtonProps {
  fullwidth?: boolean;
  disabled?: boolean;
  color?: string;
}

const StyledButton = styled(Button)<ButtonProps>`
  ${props =>
    props.fullwidth === true &&
    css`
      width: 100%;
      margin-top: 1rem;
    `}
  ${props =>
    props.color &&
    css`
      color: ${props.color};
    `}
    :disabled {
    opacity: 0.4;
  }
`;

export default StyledButton;
