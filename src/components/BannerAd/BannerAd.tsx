import React from 'react';

import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { BREAK_POINTS } from '@theme';

import { ads } from './constants';

const { SCREEN_SM } = BREAK_POINTS;

const AdWrapper = styled.div`
  margin-bottom: 14px;
  cursor: pointer;
`;

const BannerImageDesktop = styled.img`
  width: 100%;
  height: auto;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  border-radius: 3px;

  @media (max-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const BannerImageMobile = styled.img`
  width: 100%;
  height: auto;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.07);
  border-radius: 3px;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

export default function BannerAd() {
  const randomIndex = Math.floor(Math.random() * ads.length);
  const ad = ads[randomIndex];
  const isExternalLink = ad.url.startsWith('http');

  return (
    <AdWrapper>
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
