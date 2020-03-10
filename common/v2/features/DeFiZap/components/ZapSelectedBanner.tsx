import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { COLORS, SPACING, BREAK_POINTS, FONT_SIZE, LINE_HEIGHT } from 'v2/theme';

import { IZapConfig } from '../config';
import { ProtocolTagsList } from '.';

interface Props {
  zapSelected: IZapConfig;
}

const BannerContainer = styled.div`
  display: flex;
  flex: 1;
  padding: ${SPACING.BASE};
  flex-direction: column;
  background-color: ${COLORS.GREY_LIGHTEST};
  margin-bottom: ${SPACING.MD};
`;

const BannerSubItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${SPACING.BASE};
`;

const BannerSubItemLabel = styled.p`
  display: flex;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: ${SPACING.XS};
  line-height: ${LINE_HEIGHT.BASE};
`;

const BannerSubItemText = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-bottom: 0px;
  line-height: ${LINE_HEIGHT.BASE};
  flex-direction: column;
  @media (min-width: ${BREAK_POINTS.SCREEN_XS}) {
    font-size: ${FONT_SIZE.BASE};
    flex-direction: row;
  }
`;

const ZapNameGrey = styled.p`
  color: ${COLORS.GREY};
  margin: 0px;
`;

const ZapSelectedBanner = ({ zapSelected }: Props) => {
  const IndicatorItem = zapSelected.positionDetails;
  return (
    <BannerContainer>
      <BannerSubItemText>{translateRaw('ZAP_BANNER_DESCRIPTION')}</BannerSubItemText>
      <BannerSubItem>
        <BannerSubItemLabel>{translateRaw('ZAP_NAME')}</BannerSubItemLabel>
        <BannerSubItemText>
          <div>{zapSelected.title}</div>
          <ZapNameGrey>{zapSelected.name}</ZapNameGrey>
          <IndicatorItem />
        </BannerSubItemText>
      </BannerSubItem>
      <BannerSubItem>
        <BannerSubItemLabel>{translateRaw('PLATFORMS')}</BannerSubItemLabel>
        <BannerSubItemText>
          <ProtocolTagsList platformsUsed={zapSelected.platformsUsed} />
        </BannerSubItemText>
      </BannerSubItem>
    </BannerContainer>
  );
};

export default ZapSelectedBanner;
