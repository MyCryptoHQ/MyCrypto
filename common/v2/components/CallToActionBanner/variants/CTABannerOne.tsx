import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BREAK_POINTS, COLORS } from 'v2/theme';
import { Button, Typography, ConfigProps } from '../..';

const { SCREEN_SM } = BREAK_POINTS;

const CTAWrapper = styled.div`
  margin-bottom: 14px;
  background-color: ${COLORS.BRIGHT_SKY_BLUE};
  cursor: pointer;
`;

const BannerDesktop = styled.div`
  width: 100%;
  height: auto;
  display: flex;

  @media (max-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const BannerMobile = styled.div`
  width: 100%;
  height: auto;

  @media (min-width: ${SCREEN_SM}) {
    display: none;
  }
`;

const BannerHeader = styled.div`
  padding-top: 11px;
`;

const BannerDescription = styled.div`
  padding-top: 11px;
`;

const CTABannerVariantOne = ({ config }: ConfigProps) => {
  return (
    <CTAWrapper>
      <Link to={config.link}>
        <BannerDesktop>
          <BannerHeader>
            <Typography
              value={config.title}
              fontSize={'1.5rem'}
              style={{ fontWeight: 'bold', color: COLORS.WHITE }}
            />
          </BannerHeader>
          <BannerDescription>
            <Typography
              value={config.description}
              style={{ color: COLORS.DARK_BLUE_VARIANT_TWO }}
            />
          </BannerDescription>
          <Button>{config.buttonText}</Button>
        </BannerDesktop>
        <BannerMobile>meh2?</BannerMobile>
      </Link>
    </CTAWrapper>
  );
};

export default CTABannerVariantOne;
