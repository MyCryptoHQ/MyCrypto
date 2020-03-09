import React from 'react';
import styled from 'styled-components';

import { SPACING, COLORS } from 'v2/theme';
import { Typography } from 'v2/components';

import bullishIndicator from 'assets/images/defizap/indicators/bullishIndicator.svg';
import bearishIndicator from 'assets/images/defizap/indicators/bearishIndicator.svg';

interface SProps {
  color: string;
}

const SContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
`;

const SImage = styled.img`
  height: 16px;
  width: 16px;
`;

const SText = styled(Typography)`
  padding-left: ${SPACING.XS};
  color: ${(props: SProps) => props.color || COLORS.PURPLE};
  margin-bottom: 0px;
  font-weight: bold;
`;

interface IndicatorProps {
  text: string;
}

export const BullishIndicator = ({ text }: IndicatorProps) => (
  <SContainer>
    <SImage src={bullishIndicator} />
    <SText color={COLORS.PURPLE}>{text}</SText>
  </SContainer>
);

export const BearishIndicator = ({ text }: IndicatorProps) => (
  <SContainer>
    <SImage src={bearishIndicator} />
    <SText color={COLORS.SALMON_ORANGE}>{text}</SText>
  </SContainer>
);
