import React from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import translate from 'v2/translations';
import { COLORS, BREAK_POINTS } from 'v2/theme';
import { GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK } from 'v2/config';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

import vaultIcon from 'common/assets/images/icn-vault2.svg';
import protectIcon from 'common/assets/images/icn-protect.svg';
import openSourceIcon from 'common/assets/images/icn-opensource.svg';

const { SCREEN_SM, SCREEN_MD, SCREEN_XL, SCREEN_XXL } = BREAK_POINTS;
const { GREYISH_BROWN } = COLORS;

const MainPanel = styled(Panel)`
padding: 0;
display: flex;
flex-direction: column;
align-items: center;
flex: 1;
padding: 120px;
max-width: ${SCREEN_XXL};

@media (max-width: ${SCREEN_MD}}) {
  padding: 88px 148px;
}

@media (max-width: ${SCREEN_SM}) {
  padding: 42px 12px;
}
`;

const TitleArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  order: 1;
`;

const Title = styled.p`
  font-size: 35px;
  font-weight: bold;
  color: ${GREYISH_BROWN};
  line-height: normal;
  max-width: 559px;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 23px;
  }
`;

const Description = styled.p`
  font-size: 30px;
  line-height: 1;
  margin-top: 2px;
  font-weight: normal;
  color: ${GREYISH_BROWN};
  text-align: center;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 16px;
  }
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 96px;
  order: 2;

  @media (max-width: ${SCREEN_MD}) {
    flex-direction: column;
    margin-top: 18px;
    order: 3;
  }
`;

const ContentItemWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 0 50px;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 44px;
  }
`;

const ContentItemImage = styled.img`
  height: 138px;
  width: auto;
  object-fit: contain;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 32px;
    width: 150px;
    height: 150px;
  }

  @media (max-width: ${SCREEN_SM}) {
    margin-top: 0;
    width: 112px;
    height: 112px;
  }
`;

const ContentItemDescription = styled.p`
  font-size: 2.2vw;
  font-weight: normal;
  line-height: 1.5;
  margin-top: 25px;
  color: ${GREYISH_BROWN};

  @media (min-width: ${SCREEN_XL}) {
    font-size: 30px;
  }
  @media (max-width: ${SCREEN_MD}) {
    font-size: 24px;
    max-width: 300px;
  }
  @media (max-width: ${SCREEN_SM}) {
    margin-top: 17px;
    font-size: 18px;
    max-width: 244px;
  }
`;

const Actions = styled.div`
  margin-top: 90px;
  display: flex;
  order: 3;
  @media (max-width: ${SCREEN_MD}) {
    margin-top: 20px;
    flex-direction: column;
    order: 2;
  }
`;

const ActionButton = styled(Button)`
  font-size: 18px;
  margin: 0 50px;
  width: 300px;
  max-width: 300px;

  @media (max-width: ${SCREEN_MD}) {
    margin-top: 15px;
  }
`;

interface ContentItemProps {
  icon: string;
  description: React.ReactElement<any>;
}

const ContentItem: React.SFC<ContentItemProps> = props => {
  const { icon, description } = props;
  return (
    <ContentItemWrapper>
      <ContentItemImage src={icon} />
      <ContentItemDescription>{description}</ContentItemDescription>
    </ContentItemWrapper>
  );
};

interface PeaceOfMindPanelProps {
  downloadLink: string;
}

export default function PeaceOfMindPanel(props: PeaceOfMindPanelProps) {
  const { downloadLink } = props;

  return (
    <MainPanel basic={true}>
      <TitleArea>
        <Title>{translate('HOME_PEACE_OF_MIND_HEADER')}</Title>
        <Description>{translate('HOME_PEACE_OF_MIND_DESCRIPTION')}</Description>
      </TitleArea>
      <Content>
        <ContentItem icon={vaultIcon} description={translate('HOME_PEACE_OF_MIND_VAULT')} />
        <ContentItem icon={protectIcon} description={translate('HOME_PEACE_OF_MIND_PROTECT')} />
        <ContentItem
          icon={openSourceIcon}
          description={translate('HOME_PEACE_OF_MIND_OPENSOURCE')}
        />
      </Content>
      <Actions>
        <Link to="/add-account">
          <ActionButton onClick={trackGetStartedClick}>
            {translate('HOME_PEACE_OF_MIND_GET_STARTED')}
          </ActionButton>
        </Link>
        <ActionButton onClick={() => openDownloadLink(downloadLink)}>
          {translate('HOME_PEACE_OF_MIND_DOWNLOAD')}
        </ActionButton>
      </Actions>
    </MainPanel>
  );
}

const trackGetStartedClick = () => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `Get Started on Web button clicked`);
};

const openDownloadLink = (link: string) => {
  const target = link === DEFAULT_LINK ? '_blank' : '_self';
  window.open(link, target);
  AnalyticsService.instance.track(
    ANALYTICS_CATEGORIES.HOME,
    `Download the Desktop App button clicked`
  );
};
