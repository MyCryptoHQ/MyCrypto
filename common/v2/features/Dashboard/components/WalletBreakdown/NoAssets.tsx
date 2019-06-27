import React from 'react';
import styled from 'styled-components';

import { translate } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { COLORS } from 'v2/features/constants';

import addIcon from 'common/assets/images/icn-add-assets.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

const NoAssetsWrapper = styled.a`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PlusIcon = styled.img`
  width: 75px;
  height: 75px;
`;

const NoAssetsHeading = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #b5bfc7;
`;

const NoAssetsDescription = styled.div`
  color: #b5bfc7;
  text-align: center;
  font-weight: normal;

  > a {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

const trackBuyMyCrypto = () => {
  AnalyticsService.instance.track(
    ANALYTICS_CATEGORIES.WALLET_BREAKDOWN,
    'Link buy.mycrypto.com clicked'
  );
};

export default function NoAssets() {
  return (
    <NoAssetsWrapper
      href="https://buy.mycrypto.com/"
      target="_blank"
      rel="noreferrer"
      onClick={trackBuyMyCrypto}
    >
      <PlusIcon src={addIcon} />
      <NoAssetsHeading>{translate('WALLET_BREAKDOWN_NO_ASSETS')}</NoAssetsHeading>
      <NoAssetsDescription>{translate('WALLET_BREAKDOWN_NO_ASSETS_MORE')}</NoAssetsDescription>
    </NoAssetsWrapper>
  );
}
