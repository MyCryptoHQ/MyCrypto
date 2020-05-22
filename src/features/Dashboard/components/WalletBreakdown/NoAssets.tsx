import React from 'react';
import styled from 'styled-components';

import translate from '@translations';
import { ANALYTICS_CATEGORIES } from '@services';
import { COLORS } from '@theme';

import addIcon from '@assets/images/icn-add-assets.svg';
import useAnalytics from '@utils/useAnalytics';

const { BLUE_BRIGHT } = COLORS;

const NoAssetsWrapper = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NoAssetsCenter = styled.div`
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
    color: ${BLUE_BRIGHT};
  }
`;

const openLinkBuyMyCrypto = (trackCallback: ReturnType<typeof useAnalytics>) => {
  const url = 'buy.mycrypto.com';
  window.open(`https://${url}`, '_blank');
  trackCallback({
    actionName: `Link ${url} clicked`
  });
};

export default function NoAssets() {
  const trackLinkClicked = useAnalytics({
    category: ANALYTICS_CATEGORIES.WALLET_BREAKDOWN
  });

  return (
    <NoAssetsWrapper>
      <NoAssetsCenter onClick={() => openLinkBuyMyCrypto(trackLinkClicked)}>
        <PlusIcon src={addIcon} />
        <NoAssetsHeading>{translate('WALLET_BREAKDOWN_NO_ASSETS')}</NoAssetsHeading>
        <NoAssetsDescription>{translate('WALLET_BREAKDOWN_NO_ASSETS_MORE')}</NoAssetsDescription>
      </NoAssetsCenter>
    </NoAssetsWrapper>
  );
}
