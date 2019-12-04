import React from 'react';
import { Panel, Button } from '@mycrypto/ui';
import styled from 'styled-components';

import translate from 'v2/translations';
import { BREAK_POINTS } from 'v2/theme';
import { GITHUB_RELEASE_NOTES_URL as DEFAULT_LINK } from 'v2/config';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';

import champagneIcon from 'common/assets/images/icn-champagne-2.svg';

const { SCREEN_SM, SCREEN_MD, SCREEN_XXL } = BREAK_POINTS;

const MainPanel = styled(Panel)`
  padding: 0;
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding: 148px;
  max-width: ${SCREEN_XXL};

  @media (max-width: ${SCREEN_MD}) {
    padding: 88px 148px;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: ${SCREEN_SM}) {
    padding: 50px 12px 42px 12px;
  }
`;

const CallToAction = styled.div`
  display: flex;
  flex-direction: column;
  order: 1;

  @media (max-width: ${SCREEN_MD}) {
    order: 2;
    align-items: center;
    text-align: center;
  }
`;

const Title = styled.p`
  font-size: 35px;
  font-weight: bold;
  color: white;
  line-height: normal;
  max-width: 559px;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 23px;
  }
`;

const Description = styled.p`
  max-width: 646px;
  font-size: 30px;
  line-height: 1.5;
  margin-top: 8px;
  color: white;

  @media (max-width: ${SCREEN_SM}) {
    font-size: 16px;
  }
`;

const DownloadButton = styled(Button)`
  width: 100%;
  max-width: 300px;
  font-size: 18px;
  font-weight: normal;
  margin-top: 26px;
`;

const Image = styled.img`
  margin-left: 50px;
  width: 244px;
  height: 244px;
  order: 2;

  @media (max-width: ${SCREEN_MD}) {
    order: 1;
    margin: 0 42px 42px 0;
  }

  @media (max-width: ${SCREEN_SM}) {
    width: 127px;
    height: 127px;
  }
`;

interface Props {
  OSName: string;
  downloadLink: string;
}

export default function DownloadAppPanel({ OSName, downloadLink }: Props) {
  return (
    <MainPanel basic={true}>
      <CallToAction>
        <Title>{translate('HOME_DOWNLOAD_TITLE')}</Title>
        <Description>{translate('HOME_DOWNLOAD_DESCRIPTION')}</Description>
        <DownloadButton onClick={() => openDownloadLink(downloadLink, OSName)}>
          {translate('HOME_DOWNLOAD_BUTTON')} {OSName}
        </DownloadButton>
      </CallToAction>
      <Image className="image" src={champagneIcon} />
    </MainPanel>
  );
}

const openDownloadLink = (link: string, os: string) => {
  const target = link === DEFAULT_LINK ? '_blank' : '_self';
  window.open(link, target);
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HOME, `${os} download button clicked`);
};
