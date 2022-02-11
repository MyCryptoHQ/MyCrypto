import { ComponentProps, ReactNode } from 'react';

import { Button } from '@mycrypto/ui';
import styled, { css } from 'styled-components';

import { COLORS, SPACING } from '@theme';

import Spinner from './Spinner';
import Typography from './Typography';

const ButtonColorSchemes = {
  default: 'default',
  inverted: 'inverted',
  warning: 'warning',
  transparent: 'transparent'
};

type TButtonColorScheme = keyof typeof ButtonColorSchemes;

interface ButtonProps {
  children: ReactNode | string;
  fullwidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  colorScheme?: TButtonColorScheme;
}

interface StyledButtonProps {
  fullwidth?: boolean;
  disabled?: boolean;
  colorScheme?: TButtonColorScheme;
  // Since using 'loading' causes warnings from React
  _loading?: boolean;
}

export type Props = ButtonProps & ComponentProps<typeof Button>;

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
    props.disabled &&
    `
      cursor: default;
    `}

  ${(props) =>
    props.colorScheme === 'default' &&
    `
      background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT};

      &:hover {
        background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH};
      }
  `}

  ${(props) =>
    props.colorScheme === 'inverted' &&
    `
      background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};

      div > span {
        color:  ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH};
      }

      &:hover {
        div > span {
          color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};
        }
      }

      border: 2px solid ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH};
      border-radius: 3px;

      &:hover {
        background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH};
      }
      &:focus {
        div > span {
          color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};
        }
      }
  `}

  ${(props) =>
    props.colorScheme === 'warning' &&
    `
      background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};

      div > span {
        color: ${props.disabled ? COLORS.WHITE : COLORS.WARNING_ORANGE};
      }

      &:hover {
        div > span {
          color: ${COLORS.WHITE};
        }
      }

      border: 2px solid ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WARNING_ORANGE};
      border-radius: 3px;

      &:hover {
        background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WARNING_ORANGE};
      }
      &:focus {
        div > span {
          color: ${COLORS.WHITE};
        }
      }
  `}

  ${(props) =>
    props.colorScheme === 'transparent' &&
    `
      background-color: ${props.disabled ? COLORS.GREY_LIGHT : 'transparent'};

      div > span {
        color:  ${props.disabled ? COLORS.WHITE : COLORS.WHITE};
      }

      &:hover {
        div > span {
          color: ${props.disabled ? COLORS.WHITE : COLORS.BLUE_LIGHT};
        }
      }

      border: 2px solid ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};
      border-radius: 3px;

      &:hover {
        background-color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};
      }
      &:focus {
        div > span {
          color: ${props.disabled ? COLORS.GREY_LIGHT : COLORS.WHITE};
        }
      }
  `}


  ${(props) =>
    props.fullwidth &&
    css`
      width: 100%;
      margin-top: 1rem;
    `}
`;

function StyledButton({ children, disabled, loading, colorScheme = 'default', ...props }: Props) {
  return (
    <SButton disabled={disabled ?? loading} _loading={loading} colorScheme={colorScheme} {...props}>
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
