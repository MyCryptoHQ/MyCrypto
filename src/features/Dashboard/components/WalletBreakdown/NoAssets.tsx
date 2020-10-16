import React from 'react';

import styled from 'styled-components';

import addIcon from '@assets/images/icn-add-assets.svg';
import { BUY_MYCRYPTO_WEBSITE } from '@config';
import { COLORS } from '@theme';
import translate from '@translations';
import { openLink } from '@utils';

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

export default function NoAssets() {
  return (
    <NoAssetsWrapper>
      <NoAssetsCenter onClick={() => openLink(BUY_MYCRYPTO_WEBSITE)}>
        <PlusIcon src={addIcon} />
        <NoAssetsHeading>{translate('WALLET_BREAKDOWN_NO_ASSETS')}</NoAssetsHeading>
        <NoAssetsDescription>{translate('WALLET_BREAKDOWN_NO_ASSETS_MORE')}</NoAssetsDescription>
      </NoAssetsCenter>
    </NoAssetsWrapper>
  );
}
