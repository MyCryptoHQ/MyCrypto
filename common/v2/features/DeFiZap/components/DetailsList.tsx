import React from 'react';
import styled from 'styled-components';

import { COLORS, SPACING } from 'v2/theme';
import { Button } from 'v2/components';

import { IZapConfig } from '../config';
import { getPlatformColor } from '../helpers';

const DetailsListHeader = styled.h4`
  color: ${COLORS.PURPLE};
`;

const ProtocolTagContainer = styled.ul`
  margin-bottom: 0px;
  padding: 0px;
  & li {
    &:not(:last-of-type) {
      margin-right: ${SPACING.XS};
    }
  }
`;

const DetailsBulletPoints = styled.ol`
  padding-bottom: ${SPACING.XS};
  padding-inline-start: ${SPACING.MD};
  font-weight: bold;
`;

const DetailsPlatformsUsed = styled.div`
  padding-bottom: ${SPACING.MD};
`;

const ProtocolTag = styled.li`
  display: inline-block;
  text-align: center;
  background: ${props => props.color};
  border-radius: 600px;
  color: ${COLORS.WHITE};
  font-size: 0.6em;
  font-weight: normal;
  padding: 3px 6px;
`;

interface Props {
  zapSelected: IZapConfig;
  onSubmit(): void;
}

const DetailsList = (props: Props) => {
  const { zapSelected, onSubmit } = props;
  const { platformsUsed, bulletPoints, positionDetails } = zapSelected;
  return (
    <>
      <DetailsListHeader>{positionDetails}</DetailsListHeader>
      <DetailsBulletPoints>
        {bulletPoints.map(bulletPoint => (
          <li key={bulletPoint}>{bulletPoint}</li>
        ))}
      </DetailsBulletPoints>
      <DetailsPlatformsUsed>
        Platforms used:
        <ProtocolTagContainer>
          {platformsUsed.map(platform => (
            <ProtocolTag key={platform} color={getPlatformColor(platform)}>
              {platform}
            </ProtocolTag>
          ))}
        </ProtocolTagContainer>
      </DetailsPlatformsUsed>
      <Button onClick={onSubmit}>Start Earning Now!</Button>
    </>
  );
};

export default DetailsList;
