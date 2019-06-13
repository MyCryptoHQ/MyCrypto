import React from 'React';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ads } from './constants';
import { BREAK_POINTS } from 'v2/features/constants';

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

export default function BannerAd() {
  const randomIndex = Math.floor(Math.random() * ads.length);
  const desktopImage = ads[randomIndex].srcDesktop;
  const mobileImage = ads[randomIndex].srcMobile;
  const url = ads[randomIndex].url;
  const externalLink = url.startsWith('http');

  return (
    <AdWrapper>
      {externalLink ? (
        <a href={url} target="_blank" rel="noreferrer">
          <BannerImageDesktop src={desktopImage} />
          <BannerImageMobile src={mobileImage} />
        </a>
      ) : (
        <Link to={url}>
          <BannerImageDesktop src={desktopImage} />
          <BannerImageMobile src={mobileImage} />
        </Link>
      )}
    </AdWrapper>
  );
}
