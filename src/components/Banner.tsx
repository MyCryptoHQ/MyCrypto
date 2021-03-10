import React from 'react';

import styled from 'styled-components';

import announcementSVG from '@assets/images/icn-announcement.svg';
import errorSVG from '@assets/images/icn-toast-error.svg';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import { BannerType } from '@types';

import { default as Typography } from './Typography';

interface Props {
  value: string | React.ReactElement<any>;
  type: BannerType;
  displayIcon?: boolean
}

interface Config {
  bgColor: string;
  color: string;
  icon?: string;
}

interface BannerTypographyProps {
  color: string;
}

const Container = styled.div`
  background-color: ${(p: { config: Config }) => p.config.bgColor || 'transparent'};
  color: ${(p) => p.config.color || 'inherit'};
  padding: 5px 25px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  font-size: ${FONT_SIZE.SM};
  & > img {
    vertical-align: top;
    margin-right: 1ch;
    margin-top: 5px;
  }

  /*
    In mobile we let the icon stay top-aligned with the text
    as screen grows we remove the arbitray value used to align the icon. */
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    align-items: center;
    & > img {
      margin-top: 0;
    }
  }
`;

const Icon = styled.img`
  height: 1em;
  margin-right: ${SPACING.XS};
`;

const STypography = styled(Typography)<BannerTypographyProps>`
  color: ${(props) => props.color};
  a {
    color: ${(props) => props.color};
    text-decoration: underline;
    font-weight: normal;
  }

  a:hover {
    color: ${(props) => props.color};
    font-weight: bold;
  }
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
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
    case BannerType.NOTIFICATION:
      return {
        color: COLORS.WHITE,
        bgColor: COLORS.WARNING_ORANGE
      };
  }
};

export const Banner = ({ value, type, displayIcon = true, ...props }: Props) => {
  const config = bannerConfig(type);
  return (
    <Container config={config} {...props}>
      <RowContainer>
        {config.icon && displayIcon && <Icon src={config.icon} alt={type} />}

        <STypography color={config.color} fontSize={FONT_SIZE.SM}>
          {value}
        </STypography>
      </RowContainer>
    </Container>
  );
};
