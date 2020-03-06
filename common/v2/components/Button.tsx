import React from 'react';

import styled, { css } from 'styled-components';
import { Button } from '@mycrypto/ui';

import Spinner from './Spinner';
import Typography from './Typography';
import { COLORS, SPACING } from 'v2/theme';

interface ButtonProps {
  children: React.ReactNode | string;
  fullwidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  color?: string;
}

interface StyledButtonProps {
  fullwidth?: boolean;
  disabled?: boolean;
  // Since using 'loading' causes warnings from React
  _loading?: boolean;
}

export type Props = ButtonProps & React.ComponentProps<typeof Button>;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinnerWrapper = styled.div`
  display: flex;
  margin-right: ${SPACING.XS};
`;

const TextWrapper = styled(Typography)<{ color?: string }>`
  color: ${props => (props.color ? props.color : COLORS.WHITE)};
`;

// CSS calculation since Spinner has a constant size of 1em
const SButton = styled(Button)<StyledButtonProps>`
  &&& {
    font-size: 1rem;
    ${props => props._loading && 'padding-left: calc(2.25em - 1em)'}
  }

  background-color: ${props => (props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT)};

  :hover {
    background-color: ${props => (props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH)};
  }

  ${props =>
    props.fullwidth &&
    css`
      width: 100%;
      margin-top: 1rem;
    `}
`;

function StyledButton({ children, disabled, loading, color, ...props }: Props) {
  return (
    <SButton disabled={disabled || loading} _loading={loading} {...props}>
      <Wrapper>
        {loading && (
          <LoadingSpinnerWrapper>
            <Spinner />
          </LoadingSpinnerWrapper>
        )}
        <TextWrapper color={color}>{children}</TextWrapper>
      </Wrapper>
    </SButton>
  );
}

export default StyledButton;
