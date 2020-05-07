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
  inverted?: boolean;
}

interface StyledButtonProps {
  fullwidth?: boolean;
  disabled?: boolean;
  inverted?: boolean;
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

// CSS calculation since Spinner has a constant size of 1em
const SButton = styled(Button)<StyledButtonProps>`
  &&& {
    font-size: 1rem;
    ${(props) => props._loading && 'padding-left: calc(2.25em - 1em)'}
  }

  div > span {
    color: ${COLORS.WHITE};
  }

  ${(props) =>
    !props.inverted &&
    `
      background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT};

      :hover {
        background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH};
      }
  `}

  ${(props) =>
    props.inverted &&
    `
      background-color: ${COLORS.WHITE};

      div > span {
        color: ${COLORS.BLUE_LIGHT_DARKISH};
      }

      &:hover {
        div > span {
          color: ${COLORS.WHITE};
        }
      }

      border: 2px solid ${COLORS.BLUE_LIGHT_DARKISH};
      border-radius: 3px;

      &:hover {
        background-color: ${COLORS.BLUE_LIGHT_DARKISH};
      }
      &:focus {
        background-color: ${COLORS.WHITE};
      }
  `}

  ${(props) =>
    props.fullwidth &&
    css`
      width: 100%;
      margin-top: 1rem;
    `}
`;

function StyledButton({ children, disabled, loading, ...props }: Props) {
  return (
    <SButton disabled={disabled || loading} _loading={loading} {...props}>
      <Wrapper>
        {loading && (
          <LoadingSpinnerWrapper>
            <Spinner />
          </LoadingSpinnerWrapper>
        )}
        <Typography>{children}</Typography>
      </Wrapper>
    </SButton>
  );
}

export default StyledButton;
