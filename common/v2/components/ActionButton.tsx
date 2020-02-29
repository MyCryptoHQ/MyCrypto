import React from 'react';
import styled from 'styled-components';

import Button from './Button';
import Spinner from './Spinner';
import Typography from './Typography';
import { COLORS, SPACING } from 'v2/theme';

interface Props {
  value: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?(): void;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LoadingSpinnerWrapper = styled.div`
  display: flex;
  margin-right: ${SPACING.XS};
`;

// CSS calculation since Spinner has a constant size of 1em
const TextWrapper = styled(Typography)<{ loading?: boolean }>`
  color: ${COLORS.WHITE};
  ${props => props.loading && `margin-right: calc(1em + ${SPACING.XS})`};
`;

const SButton = styled(Button)`
  background-color: ${props => (props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT)};
  &&& {
    opacity: 1;
  }

  :hover {
    background-color: ${props => (props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT_DARKISH)};
  }
`;

function ActionButton({ value, disabled, loading, ...props }: Props) {
  return (
    <SButton disabled={disabled || loading} {...props}>
      <Wrapper>
        {loading && (
          <LoadingSpinnerWrapper>
            <Spinner />
          </LoadingSpinnerWrapper>
        )}
        <TextWrapper loading={loading}>{value}</TextWrapper>
      </Wrapper>
    </SButton>
  );
}

export default ActionButton;
