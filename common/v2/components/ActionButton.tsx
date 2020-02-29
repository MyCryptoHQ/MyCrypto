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

const TextWrapper = styled(Typography)`
  color: ${COLORS.WHITE};
`;

const SButton = styled(Button)`
  background-color: ${props => (props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT)};

  :hover {
    background-color: ${props => (props.disabled ? COLORS.GREY_LIGHT : COLORS.BLUE_LIGHT)};
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
        <TextWrapper>{value}</TextWrapper>
      </Wrapper>
    </SButton>
  );
}

export default ActionButton;
