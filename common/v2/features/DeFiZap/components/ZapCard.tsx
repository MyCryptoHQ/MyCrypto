import React from 'react';
import styled from 'styled-components';

import { RouterLink } from 'v2/components';
import { ROUTE_PATHS } from 'v2/config';

import { fetchRiskText } from '../config';
import { COLORS } from 'v2/theme';

const ZapCardContainer = styled('li')`
  background: #ffffff;
  border: 1px solid #1eb8e7;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 0px;
  &:not(:last-child) {
    margin-right: 15px;
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
  padding: 15px 15px 0 15px;
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
  padding: 30px 0;
  height: 24px;
  flex-direction: row;
  align-items: center;
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
const ZapCardNameSection = styled('div')`
  display: flex;
  justify-content: left;
  flex-direction: column;
  margin-left: 1em;
  & h5 {
    font-weight: bold;
  }
  & p {
    color: ${COLORS.GREY};
  }
`;

const ZapCardImgSection = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ZapCardHeaderText = styled('div')`
  margin-left: 0.5em;
`;

const ZapCard = ({ config }: any) => {
  const selectImageGivenRisk = (risk: number) => {
    switch (risk) {
      case 1:
        return 'https://via.placeholder.com/32';
      case 2:
        return 'https://via.placeholder.com/32';
      case 3:
        return 'https://via.placeholder.com/32';
      case 4:
        return 'https://via.placeholder.com/32';
      case 5:
        return 'https://via.placeholder.com/32';
    }
  };

  return (
    <ZapCardContainer>
      <ZapCardHeader>
        <img src={selectImageGivenRisk(config.risk)} />
        <ZapCardHeaderText>{`${fetchRiskText(config.risk)} Risk Profile`}</ZapCardHeaderText>
      </ZapCardHeader>
      <ZapCardContent>
        <ZapCardContentHeaderRow>
          <ZapCardImgSection>
            <img src={'https://via.placeholder.com/52'} />
          </ZapCardImgSection>
          <ZapCardNameSection>
            <h5>{config.name}</h5>
            <p>{config.key}</p>
          </ZapCardNameSection>
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
