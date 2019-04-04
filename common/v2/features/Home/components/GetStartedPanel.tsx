import React from 'react';
import { Link } from 'react-router-dom';
import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import translate, { translateRaw } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { COLORS, BREAK_POINTS } from 'v2/features/constants';

// Legacy
import titleIllustration from 'common/assets/images/title-illustration.svg';
import newWalletIcon from 'common/assets/images/icn-new-wallet.svg';
import existingWalletIcon from 'common/assets/images/icn-existing-wallet.svg';
import signInIcon from 'common/assets/images/returning.svg';

const { SCREEN_SM, SCREEN_LG, SCREEN_XL, SCREEN_XXL } = BREAK_POINTS;
const { GREYISH_BROWN, SILVER } = COLORS;

const MainPanel = styled(Panel)`
  padding-left: 148px;
  padding-bottom: 24px;
  display: flex;
  width: 100%;
  max-width: ${SCREEN_XXL};

  @media (min-width: ${SCREEN_XXL}) {
    padding: 0 148px 24px 148px;
  }

  @media (max-width: ${SCREEN_LG}) {
    padding-left: 64px;
  }

  @media (max-width: ${SCREEN_SM}) {
    padding: 0 12px;
  }
`;

const TitleImageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  width: 60%;
  background-color: white;

  @media (max-width: ${SCREEN_SM}) {
    display: none;
  }

  img {
    max-width: 88%;
    margin-right: 32px;
  }
`;

const ActionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  background-color: white;
  padding-top: 30px;
  @media (max-width: ${SCREEN_SM}) {
    flex: 1;
    padding: 0 0 24px 0;
    align-items: center;
  }
`;

const Title = styled.p`
  font-weight: bold;
  font-size: 3.1vw;
  font-weight: 900;
  line-height: normal;
  color: ${GREYISH_BROWN};
  @media (max-width: ${SCREEN_SM}) {
    font-size: 25px;
  }

  @media (min-width: ${SCREEN_XL}) {
    font-size: 45px;
  }
`;

const Description = styled.p`
  font-size: 2vw;
  letter-spacing: normal;
  margin-top: 8px;
  font-weight: normal;
  max-width: 400px;
  color: ${GREYISH_BROWN};
  white-space: pre-line;

  @media (max-width: ${SCREEN_SM}) {
    margin-top: 0;
    font-size: 20px;
    text-align: center;
    max-width: 250px;
  }

  @media (min-width: ${SCREEN_XL}) {
    font-size: 30px;
  }
`;

const MobileImage = styled.img`
  max-width: 375px;
  width: 100%;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const ActionCardsWrapper = styled.div`
  margin-top: 1.2vw;

  @media (max-width: ${SCREEN_SM}) {
    display: flex;
    flex-direction: row;
  }
`;

const ActionCardWrapper = styled.div`
  margin-bottom: 15px;
  border-radius: 3px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  border: solid 1px ${SILVER};
  cursor: pointer;
  width: 30vw;
  max-width: 450px;

  @media (max-width: ${SCREEN_SM}) {
    margin: 0 6px;
    max-width: 105px;
  }

  &:hover {
    opacity: 0.8;
  }
`;

const LinkWrapper = styled(Link)`
  padding: 1vw 2vw
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${SCREEN_SM}) {
    flex-direction: column;
    align-items: center;
    padding: 14px 6px;
  }
`;

const ActionCaptions = styled.div`
  order: 1;
  @media (max-width: ${SCREEN_SM}) {
    order: 2;
    text-align: center;
    margin-top: 9px;
  }
`;

const ActionName = styled.p`
  font-size: 1.6vw;
  font-weight: bold;
  margin-bottom: 0;
  color: ${GREYISH_BROWN};

  @media (max-width: ${SCREEN_SM}) {
    font-size: 16px;
    line-height: normal;
  }
  @media (min-width: ${SCREEN_XL}) {
    font-size: 26px;
  }
`;

const ActionDescription = styled.p`
  font-size: 1.1vw;
  font-weight: normal;
  color: ${GREYISH_BROWN};

  @media (max-width: ${SCREEN_SM}) {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.2;
  }
  @media (min-width: ${SCREEN_XL}) {
    font-size: 20px;
  }
`;

const ActionIcon = styled.img`
  width: 4vw;
  height: auto;
  max-width: 60px;
  max-height: 60px;
  object-fit: contain;
  order: 2;

  @media (max-width: ${SCREEN_SM}) {
    order: 1;
    width: 50px;
    height: 50px;
  }
`;

interface ActionCardProps {
  name: string;
  description: React.ReactElement<any>;
  icon: string;
  link: string;
  eventAction: string;
}

const trackButtonClick = (button: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${button} button clicked`);
};

const ActionCard: React.SFC<ActionCardProps> = props => {
  const { name, description, icon, link, eventAction } = props;
  return (
    <ActionCardWrapper onClick={() => trackButtonClick(eventAction)}>
      <LinkWrapper to={link}>
        <ActionCaptions>
          <ActionName>{name}</ActionName>
          <ActionDescription>{description}</ActionDescription>
        </ActionCaptions>
        <ActionIcon src={icon} alt={name} className="icon" />
      </LinkWrapper>
    </ActionCardWrapper>
  );
};

export default function GetStartedPanel() {
  return (
    <MainPanel basic={true}>
      <ActionsWrapper>
        <Title>{translate('HOME_GET_STARTED_TITLE')}</Title>
        <Description>{translate('HOME_GET_STARTED_DESCRIPTION')}</Description>
        <MobileImage src={titleIllustration} alt="Title Illustration" />
        <ActionCardsWrapper>
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_NEED_WALLET_TITLE')}
            description={translate('HOME_GET_STARTED_NEED_WALLET_DESCRIPTION')}
            icon={newWalletIcon}
            link={'/download-desktop-app'}
            eventAction="I need a wallet"
          />
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_HAVE_WALLET_TITLE')}
            description={translate('HOME_GET_STARTED_HAVE_WALLET_DESCRIPTION')}
            icon={existingWalletIcon}
            link={'/'} //TODO: Replace with route to Wallet import flow
            eventAction="I have a wallet"
          />
          <ActionCard
            name={translateRaw('HOME_GET_STARTED_USED_TITLE')}
            description={translate('HOME_GET_STARTED_USED_DESCRIPTION')}
            icon={signInIcon}
            link={'/dashboard'}
            eventAction="I've used MyCrypto"
          />
        </ActionCardsWrapper>
      </ActionsWrapper>
      <TitleImageWrapper>
        <img src={titleIllustration} alt="Title Illustration" />
      </TitleImageWrapper>
    </MainPanel>
  );
}
