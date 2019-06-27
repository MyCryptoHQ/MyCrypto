import React from 'react';
import styled from 'styled-components';

import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { COLORS } from 'v2/features/constants';

import addIcon from 'common/assets/images/icn-add-assets.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

const NoAssetsWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const NoAssetsBreakdownHeading = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #424242;

  @media (min-width: 1080px) {
    font-size: 24px;
  }
`;

const NoAssetsBreakdownContent = styled.a`
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

  > span {
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
    <NoAssetsWrapper>
      <NoAssetsBreakdownHeading>Wallet Breakdown</NoAssetsBreakdownHeading>
      <NoAssetsBreakdownContent
        href="https://buy.mycrypto.com/"
        target="_blank"
        rel="noreferrer"
        onClick={trackBuyMyCrypto}
      >
        <PlusIcon src={addIcon} />
        <NoAssetsHeading>No Assets Found</NoAssetsHeading>
        <NoAssetsDescription>
          You can <span>buy some ETH</span> with your credit card to get started!
        </NoAssetsDescription>
      </NoAssetsBreakdownContent>
    </NoAssetsWrapper>
  );
}
