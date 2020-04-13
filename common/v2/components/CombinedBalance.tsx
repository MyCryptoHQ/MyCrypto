import React from 'react';
import styled, { css } from 'styled-components';
import { formatEther } from 'ethers/utils';

import { StoreAsset, Fiat, Asset } from 'v2/types';
import { SPACING, COLORS, FONT_SIZE } from 'v2/theme';
import { TSymbol } from 'v2/types/symbols';
import { trimBN } from 'v2/utils/convert';

import AssetIcon from './AssetIcon';
import Currency from './Currency';

const BalanceAssetIcon = styled(AssetIcon)`
  margin-right: ${SPACING.SM};
`;

const BalanceAssetInfo = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
`;

const SAssetIcon = styled(AssetIcon)`
  width: 56px;
  height: 56px;
`;

const CCircle = styled('div')`
  position: absolute;
  filter: grayscale(1); /* W3C */
  bottom: 0px;
  right: 0px;
  height: 24px;
`;

const Combined = styled.div`
  position: relative;
`;

const SCombinedCircle = (asset: Asset) => (
  <CCircle>
    <BalanceAssetIcon symbol={asset.ticker as TSymbol} />
  </CCircle>
);

const makeDefiIcon = (assetOne: Asset, assetTwo: Asset) => {
  console.debug('got here?', assetOne, assetTwo);
  const greyscaleIcon = assetTwo && <>{SCombinedCircle(assetTwo)}</>;
  const baseIcon = (
    <Combined>
      <SAssetIcon symbol={assetOne.ticker as never} />
      {greyscaleIcon}
    </Combined>
  );
  return baseIcon;
};

const BalanceAssetName = styled.div`
  margin: 0;
  cursor: pointer;
`;

const BalanceAssetAmount = styled(BalanceAssetName)`
  a {
    color: ${COLORS.BLUE_BRIGHT};
  }
  ${(props: { silent?: boolean }) =>
    props.silent === true &&
    css`
      color: ${COLORS.BLUE_GREY};
      font-size: ${FONT_SIZE.SM};
    `};
`;

interface Props {
  fiat: Fiat;
  assets: StoreAsset[];
  fiatValue: number;
  isOther?: boolean;
}

const CombinedBalance = ({ fiat, assets, isOther, fiatValue }: Props) => {
  if (!fiat || assets.length === 0) return <></>;
  assets = assets.reverse();
  const Iconn =
    assets.length > 1 ? (
      makeDefiIcon(assets[0], assets[1])
    ) : (
      <SAssetIcon symbol={assets[0].ticker as never} />
    );

  return (
    <>
      <BalanceAssetInfo>{Iconn}</BalanceAssetInfo>
      <BalanceAssetAmount>
        <Currency
          amount={fiatValue.toString()}
          symbol={fiat.symbol}
          prefix={fiat.prefix}
          decimals={2}
        />
        {assets.length >= 1 &&
          assets.map(asset => (
            <BalanceAssetAmount silent={true} key={`amt-${asset.ticker}`}>
              {!isOther &&
                `${parseFloat(trimBN(formatEther(asset.balance.toString()))).toFixed(4)} ${
                  asset.ticker
                }`}
            </BalanceAssetAmount>
          ))}
      </BalanceAssetAmount>
    </>
  );
};
export default CombinedBalance;
