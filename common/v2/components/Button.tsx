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
    :disabled {
    opacity: 0.4;
  }
  color: ${props => (props.color ? props.color : 'inherit')};
`;

export default StyledButton;
