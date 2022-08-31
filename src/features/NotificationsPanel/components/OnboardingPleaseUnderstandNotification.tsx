import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import cantAccessIcon from '@assets/images/onboarding/icn-cant-access.svg';
import cantFreezeIcon from '@assets/images/onboarding/icn-cant-freeze.svg';
import cantModifyIcon from '@assets/images/onboarding/icn-cant-modify.svg';
import cantReverseIcon from '@assets/images/onboarding/icn-cant-reverse.svg';
import { getKBHelpArticle, KB_HELP_ARTICLE } from '@config';
import { BREAK_POINTS } from '@theme';
import translate, { translateRaw } from '@translations';

import NotificationWrapper from './NotificationWrapper';

const { SCREEN_XS, SCREEN_MD } = BREAK_POINTS;

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
  font-weight: normal;
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  @media (max-width: ${SCREEN_MD}) {
    flex-basis: 100%;
  }
`;

const TipIcon = styled.img`
  width: auto;
  height: 50px;
  margin-right: 10px;
`;

export default function OnboardingPleaseUnderstandNotification() {
  return (
    <NotificationWrapper
      alignCenterOnSmallScreen={true}
      tagline={translate('NOTIFICATIONS_ONBOARDING_TAGLINE')}
      title={`${translateRaw('NOTIFICATIONS_ONBOARDING_PLEASE_UNDERSTAND_TITLE')}:`}
      resources={
        <ResourceLink
          href={getKBHelpArticle(KB_HELP_ARTICLE.HOME)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ResourceItem secondary={true}>{translate('NOTIFICATIONS_ONBOARDING_MORE')}</ResourceItem>
        </ResourceLink>
      }
    >
      <Content>
        <TipItem>
          <TipIcon src={cantAccessIcon} />
          {translate('NOTIFICATIONS_ONBOARDING_PLEASE_UNDERSTAND_ACCESS')}
        </TipItem>
        <TipItem>
          <TipIcon src={cantModifyIcon} />
          {translate('NOTIFICATIONS_ONBOARDING_PLEASE_UNDERSTAND_MODIFY')}
        </TipItem>
        <TipItem>
          <TipIcon src={cantReverseIcon} />
          {translate('NOTIFICATIONS_ONBOARDING_PLEASE_UNDERSTAND_REVERSE')}
        </TipItem>
        <TipItem>
          <TipIcon src={cantFreezeIcon} />
          {translate('NOTIFICATIONS_ONBOARDING_PLEASE_UNDERSTAND_FREEZE')}
        </TipItem>
      </Content>
    </NotificationWrapper>
  );
}
