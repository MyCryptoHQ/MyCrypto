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

type Props = ButtonProps & React.ComponentProps<typeof Button>;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LoadingSpinnerWrapper = styled.div`
  display: flex;
  margin-right: ${SPACING.XS};
`;

const TextWrapper = styled(Typography)<{ loading?: boolean; color?: string }>`
  color: ${props => (props.color ? props.color : COLORS.WHITE)};
`;

// CSS calculation since Spinner has a constant size of 1em
const SButton = styled(Button)<ButtonProps>`
  &&& {
    font-size: 1rem;
    ${props => props.loading && 'padding-left: calc(2.25em - 1em)'}
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

function StyledButton({ children, disabled, loading, ...props }: Props) {
  return (
    <SButton disabled={disabled || loading} loading={loading} {...props}>
      <Wrapper>
        {loading && (
          <LoadingSpinnerWrapper>
            <Spinner />
          </LoadingSpinnerWrapper>
        )}
        <TextWrapper loading={loading}>{children}</TextWrapper>
      </Wrapper>
    </SButton>
  );
}

export default StyledButton;
