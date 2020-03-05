import React from 'react';
import styled from 'styled-components';

import { SPACING, COLORS } from 'v2/theme';

import bullishIndicator from 'assets/images/defizap/indicators/bullishIndicator.svg';
import bearishIndicator from 'assets/images/defizap/indicators/bearishIndicator.svg';

const IContainer = styled.div`
  display: flex;
`;

const SImage = styled.img`
  height: 16px;
  width: 16px;
`;
const IText = styled.p`
  padding-left: ${SPACING.XS};
  color: ${COLORS.PURPLE};
  margin-bottom: 0px;
  font-size: 16px;
`;

interface IndicatorProps {
  text: string;
}

export const BullishIndicator = ({ text }: IndicatorProps) => (
  <IContainer>
    <SImage src={bullishIndicator} />
    <IText>{text}</IText>
  </IContainer>
);

export const BearishIndicator = ({ text }: IndicatorProps) => (
  <IContainer>
    <SImage src={bearishIndicator} />
    <IText>{text}</IText>
  </IContainer>
);
