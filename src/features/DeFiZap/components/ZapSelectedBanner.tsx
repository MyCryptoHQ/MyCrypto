import styled from 'styled-components';

import { COLORS, SPACING } from '@theme';
import { translateRaw } from '@translations';

import { IZapConfig } from '../config';

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
  align-items: flex-start;
  margin-top: ${SPACING.BASE};
`;

const SImg = styled.img`
  width: auto;
  height: 38px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${SPACING.SM};
`;

const ZapName = styled.p`
  color: ${COLORS.BLUE_DARK};
  margin: 0 0 ${SPACING.SM} 0;
`;

const ZapSelectedBanner = ({ zapSelected }: Props) => {
  const IndicatorItem = zapSelected.positionDetails;

  return (
    <BannerContainer>
      {translateRaw('ZAP_BANNER_DESCRIPTION')}
      <BannerSubItem>
        <SImg src={zapSelected.breakdownImage} />
        <TitleWrapper>
          <div>{zapSelected.title}</div>
          <ZapName>{zapSelected.name}</ZapName>
          <IndicatorItem />
        </TitleWrapper>
      </BannerSubItem>
    </BannerContainer>
  );
};

export default ZapSelectedBanner;
