import React from 'react';
import styled from 'styled-components';

import { SPACING, COLORS } from 'v2/theme';
import { Typography } from 'v2/components';

import bullishIndicator from 'assets/images/defizap/indicators/bullishIndicator.svg';
import bearishIndicator from 'assets/images/defizap/indicators/bearishIndicator.svg';
import neutralIndicator from 'assets/images/defizap/indicators/neutralIndicator.svg';

interface SProps {
  color: string;
}

const SContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: top;
`;

const SImage = styled.img`
  height: 24px;
  width: 24px;
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
    <SText color={COLORS.PURPLE}>{text}</SText>
  </SContainer>
);

export const NeutralIndicator = ({ text }: IndicatorProps) => (
  <SContainer>
    <SImage src={neutralIndicator} />
    <SText color={COLORS.PURPLE}>{text}</SText>
  </SContainer>
);
