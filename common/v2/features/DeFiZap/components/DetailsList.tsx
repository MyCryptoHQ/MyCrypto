import React from 'react';
import styled from 'styled-components';

import { SPACING, BREAK_POINTS } from '@theme';
import { translateRaw } from '@translations';

import { IZapConfig } from '../config';
import { ProtocolTagsList } from '..';

const DetailsContainer = styled.div`
  @media (min-width: ${BREAK_POINTS.SCREEN_SM}) {
    margin-left: ${SPACING.LG};
  }
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  & > div {
    margin: ${SPACING.MD} 0;
  }
`;

const DetailsBulletPoints = styled.ol`
  margin: 0;
  padding: 0;
  counter-reset: item;
  & > li {
    padding: 0 0 0 2em;
    text-indent: -2em;
    list-style-type: none;
    counter-increment: item;
  }
  & > li:before {
    display: inline-block;
    width: 1em;
    padding-right: 0.2em;
    font-weight: bold;
    text-align: right;
    content: counter(item) '.';
  }
`;

const ProtocolContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 60px;
`;

interface Props {
  zapSelected: IZapConfig;
}

const DetailsList = ({ zapSelected }: Props) => {
  const { platformsUsed, bulletPoints } = zapSelected;
  const IndicatorItem = zapSelected.positionDetails;

  return (
    <DetailsContainer>
      <IndicatorItem />
      <DetailsBulletPoints>
        {bulletPoints.map((bulletPoint) => (
          <li key={bulletPoint}>{bulletPoint}</li>
        ))}
      </DetailsBulletPoints>
      <ProtocolContainer>
        {translateRaw('PLATFORMS')}
        <ProtocolTagsList platformsUsed={platformsUsed} />
      </ProtocolContainer>
    </DetailsContainer>
  );
};

export default DetailsList;
