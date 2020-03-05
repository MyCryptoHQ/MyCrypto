import React from 'react';
import styled from 'styled-components';

import { translateRaw } from 'v2/translations';
import { COLORS, SPACING } from 'v2/theme';

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
  margin-bottom: ${SPACING.LG};
`;

const BannerSubItem = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${SPACING.SM};
`;

const BannerSubItemLabel = styled.p`
  display: flex;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: ${SPACING.XS};
`;

const BannerSubItemText = styled.div`
  display: flex;
  margin-bottom: 0px;
`;

const ZapSelectedBanner = ({ zapSelected }: Props) => {
  return (
    <BannerContainer>
      <BannerSubItemText>{translateRaw('ZAP_BANNER_DESCRIPTION')}</BannerSubItemText>
      <BannerSubItem>
        <BannerSubItemLabel>{translateRaw('ZAP_NAME')}</BannerSubItemLabel>
        <BannerSubItemText>{`${zapSelected.title} - ${zapSelected.name}`}</BannerSubItemText>
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
