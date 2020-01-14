import React from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';
import translate from 'v2/translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { Link } from 'react-router-dom';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { KNOWLEDGE_BASE_URL } from 'v2/config';

import ovalIcon from 'common/assets/images/icn-oval.svg';
import swooshIcon from 'common/assets/images/icn-purple-swoosh.svg';
import sparklesIcon from 'common/assets/images/icn-sparkles-4.svg';

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
  position: relative;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 25px;
  }
`;

const Sparkles = styled.img`
  width: 44px;
  height: 132px;
  position: absolute;
  top: -40px;
  right: -30px;
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
  color: ${BRIGHT_SKY_BLUE};
  line-height: normal;
`;

const GraphicsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: -50px;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const Swoosh = styled.img`
  width: 47px;
  height: 48px;
  margin-left: 35px;
  margin-top: 40px;
`;

const Oval = styled.img`
  width: 145px;
  height: 123px;
`;

export default function BottomActionPanel() {
  return (
    <>
      <MainPanel basic={true}>
        <Title>
          {translate('HOME_BOTTOM_TITLE')}
          <Sparkles src={sparklesIcon} />
        </Title>
        <Link to="/add-account">
          <GetStartedButton onClick={() => trackButtonClick('Get Started')}>
            {translate('HOME_BOTTOM_GET_STARTED')}
          </GetStartedButton>
        </Link>
        <a href={KNOWLEDGE_BASE_URL} target="_blank" rel="noreferrer">
          <SupportLink onClick={() => trackButtonClick('Have Questions?')}>
            {translate('HOME_BOTTOM_HELP')}
          </SupportLink>
        </a>
      </MainPanel>
      <GraphicsWrapper>
        <Swoosh src={swooshIcon} />
        <Oval src={ovalIcon} />
      </GraphicsWrapper>
    </>
  );
}

const trackButtonClick = (button: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${button} button clicked`);
};
