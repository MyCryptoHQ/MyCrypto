import React from 'react';

import { RiskAndReward } from '../config';
import styled from 'styled-components';
import { TranslateMarkdown, Typography } from '@components';
import { SPACING, BREAK_POINTS } from '@theme';

interface Props {
  riskAndReward: RiskAndReward;
}

const Block = styled.div`
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 50%;
  margin: ${SPACING.BASE} 0;
`;
const STypography = styled(Typography)`
  width: 70%;
`;

export default ({ riskAndReward }: Props) => {
  const { icon, text } = riskAndReward;
  return (
    <Block>
      <img width="60px" src={icon} />
      <STypography>
        <TranslateMarkdown source={text} />
      </STypography>
    </Block>
  );
};
