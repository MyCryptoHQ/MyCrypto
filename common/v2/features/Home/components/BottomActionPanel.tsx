import React from 'react';
import { Panel, Typography, Button } from '@mycrypto/ui';
import styled from 'styled-components';
import { COLORS, BREAK_POINTS } from 'v2/features/constants';

import './BottomActionPanel.scss';
import translate from 'translations';
import { MYCRYPTO_SUPPORT_URL } from 'v2/features/constants';

const { SCREEN_SM } = BREAK_POINTS;
const { DARK_SLATE_BLUE, BRIGHT_SKY_BLUE } = COLORS;

const MainPanel = styled(Panel)`
  padding: 84px 84px 46px 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  line-height: normal;
  color: ${DARK_SLATE_BLUE};
  @media (max-width: ${SCREEN_SM}) {
    font-size: 25px;
  }
`;

const GetStartedButton = styled(Button)`
  font-size: 18px;
  margin-top: 60px;
  width: 300px;
  max-width: 300px;

  @media (max-width: ${SCREEN_SM}) {
    margin-top: 15px;
  }
`;

const SupportLink = styled.div`
  font-size: 18px;
  text-align: center;
  margin-top: 18px;
  font-weight: bold;
  color: ${BRIGHT_SKY_BLUE};
  line-height: normal;
`;

export default function BottomActionPanel() {
  return (
    <MainPanel basic={true}>
      <Title>{translate('HOME_BOTTOM_TITLE')}</Title>
      <GetStartedButton>{translate('HOME_BOTTOM_GET_STARTED')}</GetStartedButton>
      <a href={MYCRYPTO_SUPPORT_URL} target="_blank" rel="noreferrer">
        <SupportLink>{translate('HOME_BOTTOM_HELP')}</SupportLink>
      </a>
    </MainPanel>
  );
}
