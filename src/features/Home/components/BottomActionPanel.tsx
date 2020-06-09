import React from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';
import translate from '@translations';
import { ANALYTICS_CATEGORIES } from '@services';
import { Link } from 'react-router-dom';
import { COLORS, BREAK_POINTS } from '@theme';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';

import ovalIcon from '@assets/images/icn-oval.svg';
import swooshIcon from '@assets/images/icn-purple-swoosh.svg';
import sparklesIcon from '@assets/images/icn-sparkles-4.svg';
import { useAnalytics } from '@utils';

const { SCREEN_SM } = BREAK_POINTS;
const { BLUE_DARK_SLATE, BLUE_BRIGHT } = COLORS;

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
  color: ${BLUE_DARK_SLATE};
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
  color: ${BLUE_BRIGHT};
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
  const trackButtonClicked = useAnalytics({
    category: ANALYTICS_CATEGORIES.HOME
  });

  return (
    <>
      <MainPanel basic={true}>
        <Title>
          {translate('HOME_BOTTOM_TITLE')}
          <Sparkles src={sparklesIcon} />
        </Title>
        <Link to="/add-account">
          <GetStartedButton
            onClick={() => trackButtonClicked({ actionName: 'Get Started button clicked' })}
          >
            {translate('HOME_BOTTOM_GET_STARTED')}
          </GetStartedButton>
        </Link>
        <a href={getKBHelpArticle(KB_HELP_ARTICLE.HOME)} target="_blank" rel="noreferrer">
          <SupportLink
            onClick={() => trackButtonClicked({ actionName: 'Have Questions? button clicked' })}
          >
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
