import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ads } from './constants';
import { BREAK_POINTS } from 'v2/features/constants';
import { ANALYTICS_CATEGORIES, AnalyticsService } from 'v2/services';

const { SCREEN_MD, SCREEN_SM } = BREAK_POINTS;

const AdWrapper = styled.div`
  margin-bottom: 14px;
  cursor: pointer;

  @media (max-width: ${SCREEN_MD}) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const BannerImageDesktop = styled.img`
  width: 100%;
  height: auto;

  @media (max-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const BannerImageMobile = styled.img`
  width: 100%;
  height: auto;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const onAdClick = (ad: string) => {
  AnalyticsService.instance.track(ANALYTICS_CATEGORIES.AD, `${ad} ad clicked`);
};

export default function BannerAd() {
  const randomIndex = Math.floor(Math.random() * ads.length);
  const ad = ads[randomIndex];
  const isExternalLink = ad.url.startsWith('http');

  return (
    <AdWrapper onClick={() => onAdClick(ad.name)}>
      {isExternalLink ? (
        <a href={ad.url} target="_blank" rel="noreferrer">
          <BannerImageDesktop src={ad.srcDesktop} />
          <BannerImageMobile src={ad.srcMobile} />
        </a>
      ) : (
        <Link to={ad.url}>
          <BannerImageDesktop src={ad.srcDesktop} />
          <BannerImageMobile src={ad.srcMobile} />
        </Link>
      )}
    </AdWrapper>
  );
}
