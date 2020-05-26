import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ads } from './constants';
import { BREAK_POINTS } from '@theme';
import { ANALYTICS_CATEGORIES } from '@services';
import { useAnalytics } from '@utils';

const { SCREEN_SM } = BREAK_POINTS;

const AdWrapper = styled.div`
  margin-bottom: 14px;
  cursor: pointer;
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

export default function BannerAd() {
  const randomIndex = Math.floor(Math.random() * ads.length);
  const ad = ads[randomIndex];
  const isExternalLink = ad.url.startsWith('http');
  const trackAdd = useAnalytics({
    category: ANALYTICS_CATEGORIES.AD
  });

  return (
    <AdWrapper onClick={() => trackAdd({ actionName: `${ad.name} ad clicked` })}>
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
