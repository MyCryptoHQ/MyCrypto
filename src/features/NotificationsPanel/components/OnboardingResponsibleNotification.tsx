import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import jsonIcon from '@assets/images/onboarding/icn-json.svg';
import privateIcon from '@assets/images/onboarding/icn-key-mnemonic.svg';
import myCryptoIcon from '@assets/images/onboarding/icn-mnycrpto-app.svg';
import phishingIcon from '@assets/images/onboarding/icn-phishing.svg';
import { CRYPTOSCAMDB, DOWNLOAD_MYCRYPTO_LINK, getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { BREAK_POINTS, COLORS } from '@theme';
import translate, { translateRaw } from '@translations';

import NotificationWrapper from './NotificationWrapper';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;
const { BLUE_BRIGHT } = COLORS;

const ResourceLink = styled.a`
  @media (min-width: ${SCREEN_MD}) {
    margin-top: 60px;
  }
`;

const ResourceItem = styled(Button)`
  width: 200px;
  padding-left: 0px;
  padding-right: 0px;
  font-weight: normal;
  font-size: 17px;

  @media (max-width: ${SCREEN_XS}) {
    font-size: 15px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align: left;

  @media (max-width: ${SCREEN_MD}) {
    flex-direction: column;
  }
`;

const TipItem = styled.div`
  flex-basis: 50%;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  @media (max-width: ${SCREEN_MD}) {
    flex-basis: 100%;
  }
`;

const TipIconWrapper = styled.div`
  min-width: 50px;
  min-height: 50px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface TipIconProps {
  width: number;
  height: number;
}

const TipIcon = styled.img<TipIconProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const TipText = styled.p`
  font-weight: normal;
  margin: 0;

  a {
    font-weight: bold;
    color: ${BLUE_BRIGHT};
  }
`;

export default function OnboardingResponsibleNotification() {
  return (
    <NotificationWrapper
      alignCenterOnSmallScreen={true}
      tagline={translate('NOTIFICATIONS_ONBOARDING_TAGLINE')}
      title={`${translateRaw('NOTIFICATIONS_ONBOARDING_RESPONSIBLE_TITLE')}:`}
      resources={
        <ResourceLink
          href={getKBHelpArticle(KB_HELP_ARTICLE.STAYING_SAFE)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ResourceItem secondary={true}>{translate('NOTIFICATIONS_ONBOARDING_MORE')}</ResourceItem>
        </ResourceLink>
      }
    >
      <Content>
        <TipItem>
          <TipIconWrapper>
            <TipIcon width={40} height={40} src={privateIcon} />
          </TipIconWrapper>
          <TipText>{translate('NOTIFICATIONS_ONBOARDING_RESPONSIBLE_PRIVATE')}</TipText>
        </TipItem>
        <TipItem>
          <TipIconWrapper>
            <TipIcon width={40} height={40} src={phishingIcon} />
          </TipIconWrapper>
          <TipText>
            {translate('NOTIFICATIONS_ONBOARDING_RESPONSIBLE_PHISHING', {
              $link: CRYPTOSCAMDB
            })}
          </TipText>
        </TipItem>
        <TipItem>
          <TipIconWrapper>
            <TipIcon width={30} height={40} src={jsonIcon} />
          </TipIconWrapper>
          <TipText>{translate('NOTIFICATIONS_ONBOARDING_RESPONSIBLE_JSON')}</TipText>
        </TipItem>
        <TipItem>
          <TipIconWrapper>
            <TipIcon width={50} height={40} src={myCryptoIcon} />
          </TipIconWrapper>
          <TipText>
            {translate('NOTIFICATIONS_ONBOARDING_RESPONSIBLE_MYCRYPTO', {
              $link: DOWNLOAD_MYCRYPTO_LINK
            })}
          </TipText>
        </TipItem>
      </Content>
    </NotificationWrapper>
  );
}
