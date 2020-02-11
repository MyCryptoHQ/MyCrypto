import React from 'react';
import styled from 'styled-components';

import { BannerType } from 'v2/types';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { default as Typography } from './Typography';
import announcementSVG from 'assets/images/icn-announcement.svg';
import errorSVG from 'assets/images/icn-toast-error.svg';

interface Props {
  value: string | React.ReactElement<any>;
  type: BannerType;
}

interface Config {
  bgColor: string;
  color: string;
  icon: string;
}

const Container = styled.div`
  background-color: ${(p: { config: Config }) => p.config.bgColor || 'transparent'};
  color: ${p => p.config.color || 'inherit'};
  padding: 15px 10px;
  padding-right: 30px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  & > img {
    vertical-align: top;
    margin-right: 15px;
    margin-top: 5px;
  }

  // In mobile we let the icon stay top-aligned with the text
  // as screen grows we remove the arbitray value used to align the icon.
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-items: center;
    & > img {
      margin-top: 0;
    }
  }
`;

const Icon = styled.img`
  max-width: 24px;
`;

interface BannerTypographyProps {
  color: string;
}

const STypography = styled(Typography)<BannerTypographyProps>`
  color: ${props => props.color};

  a {
    color: ${props => props.color};
    text-decoration: underline;
    font-weight: normal;
  }

  a:hover {
    color: ${props => props.color};
    font-weight: bold;
  }
`;

const bannerConfig = (type: BannerType): Config => {
  switch (type) {
    default:
    case BannerType.ANNOUNCEMENT:
      return {
        color: COLORS.WHITE,
        bgColor: COLORS.BLUE_BRIGHT,
        icon: announcementSVG
      };
    case BannerType.ERROR:
      return {
        color: COLORS.WHITE,
        bgColor: COLORS.ERROR_RED,
        icon: errorSVG
      };
  }
};

export const Banner = ({ value, type, ...props }: Props) => {
  const config = bannerConfig(type);
  return (
    <Container config={config} {...props}>
      <Icon src={config.icon} alt={type} />
      <STypography value={value} color={config.color} />
    </Container>
  );
};
