import styled from 'styled-components';

import bearishIndicator from '@assets/images/defizap/indicators/bearishIndicator.svg';
import bullishIndicator from '@assets/images/defizap/indicators/bullishIndicator.svg';
import neutralIndicator from '@assets/images/defizap/indicators/neutralIndicator.svg';
import { COLORS, SPACING } from '@theme';

interface SProps {
  color: string;
}

const SContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SImage = styled.img`
  height: 16px;
  width: 16px;
`;

const SText = styled.div`
  padding-left: ${SPACING.XS};
  color: ${(props: SProps) => props.color || COLORS.PURPLE};
  margin-bottom: 0px;
  font-weight: bold;
  text-transform: uppercase;
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
