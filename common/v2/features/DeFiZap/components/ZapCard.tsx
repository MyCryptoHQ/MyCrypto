import React from 'react';
import styled from 'styled-components';

import { RouterLink } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';
import { COLORS, BREAK_POINTS } from 'v2/theme';

import { fetchRiskText, IZapConfig } from '../config';
import moderateRisk from 'assets/images/defizap/moderateRisk.svg';
import conservativeRisk from 'assets/images/defizap/conservativeRisk.svg';
import insaneRisk from 'assets/images/defizap/insaneRisk.svg';
import ludicrousRisk from 'assets/images/defizap/ludicrousRisk.svg';

const ZapCardContainer = styled('li')`
  background: #ffffff;
  border: 1px solid #1eb8e7;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0px;
  &:not(:last-child) {
    margin-bottom: 15px;
  }

  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    &:not(:last-child) {
      margin-right: 15px;
      margin-bottom: 0px;
    }
  }
`;

const ZapCardHeader = styled('div')`
  display: flex;
  background: #1eb8e7;
  height: 49px;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const ZapCardContent = styled('div')`
  display: flex;
  flex: 1;
  padding: 0px 15px 0 15px;
  flex-direction: column;
`;

const ZapCardContentRow = styled('div')`
  margin: 0px 10px;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

const ZapCardContentBottom = styled('div')`
  display: flex;
  padding: 30px 15px;
  height: 24px;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
  color: #1eb8e7;
  font-weight: normal;
  &:hover {
    color: white;
    background-color: #1eb8e7;
  }
`;
const ZapCardContentHeaderRow = styled('div')`
  margin: 0px 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;
const ZapCardHeaderTextSection = styled('div')`
  display: flex;
  justify-content: left;
  flex-direction: column;
  margin-left: 1em;
`;

const ZapCardHeaderTitle = styled.h5`
  font-weight: bold;
`;

const ZapCardHeaderName = styled.p`
  color: ${COLORS.GREY};
`;

const ZapCardImgSection = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZapCardRiskProfile = styled('div')`
  margin-left: 0.5em;
`;

interface Props {
  config: IZapConfig;
}

const ZapCard = ({ config }: Props) => {
  const selectImageGivenRisk = (risk: number) => {
    switch (risk) {
      case 1:
        return conservativeRisk;
      case 2:
        return moderateRisk;
      case 3:
        return moderateRisk;
      case 4:
        return insaneRisk;
      case 5:
        return ludicrousRisk;
    }
  };
  const IndicatorItem = config.positionDetails;
  return (
    <ZapCardContainer>
      <ZapCardHeader>
        <img src={selectImageGivenRisk(config.risk)} />
        <ZapCardRiskProfile>{`${fetchRiskText(config.risk)} Risk Profile`}</ZapCardRiskProfile>
      </ZapCardHeader>
      <ZapCardContent>
        <ZapCardContentHeaderRow>
          <ZapCardImgSection>
            <img src={'https://via.placeholder.com/52'} />
          </ZapCardImgSection>
          <ZapCardHeaderTextSection>
            <ZapCardHeaderTitle>{config.title}</ZapCardHeaderTitle>
            <ZapCardHeaderName>{config.name}</ZapCardHeaderName>
            <IndicatorItem />
          </ZapCardHeaderTextSection>
        </ZapCardContentHeaderRow>
        <ZapCardContentRow>
          <p>{config.description}</p>
        </ZapCardContentRow>
      </ZapCardContent>
      <RouterLink to={`${ROUTE_PATHS.DEFIZAP.path}/zap?key=${config.key}`}>
        <ZapCardContentBottom>{config.ctaText}</ZapCardContentBottom>
      </RouterLink>
    </ZapCardContainer>
  );
};

export default ZapCard;
