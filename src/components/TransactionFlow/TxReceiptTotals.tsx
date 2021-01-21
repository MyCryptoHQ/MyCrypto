import React from 'react';

import styled from 'styled-components';

import { Amount, AssetIcon } from '@components';
import { default as Icon } from '@components/Icon';
import { getFiat } from '@config/fiats';
import { COLORS, SPACING } from '@theme';
import translate from '@translations';
import { ExtendedAsset, ISettings } from '@types';
import { bigify, convertToFiat, fromWei, totalTxFeeToWei, Wei } from '@utils';

interface Props {
  asset: ExtendedAsset;
  assetAmount: string;
  baseAsset: ExtendedAsset;
  settings: ISettings;
  gasUsed: string;
  gasPrice: string;
  value: string;
  assetRate?: number;
  baseAssetRate?: number;
}

const SIcon = styled(Icon)`
  width: 30px;
  height: 30px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
`;

export const TxReceiptTotals = ({
  asset,
  assetAmount,
  baseAsset,
  settings,
  gasUsed,
  gasPrice,
  value,
  assetRate,
  baseAssetRate
}: Props) => {
  const feeWei = totalTxFeeToWei(gasPrice, gasUsed);

  const feeFormatted = bigify(fromWei(feeWei, 'ether')).toFixed(6);

  const valueWei = Wei(value);

  const totalWei = feeWei.plus(valueWei);

  const totalEtherFormatted = bigify(fromWei(totalWei, 'ether')).toFixed(6);

  return (
    <>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-send" alt="Sent" />
          {translate('CONFIRM_TX_SENT')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          <Amount
            fiatColor={COLORS.BLUE_SKY}
            assetValue={`${bigify(assetAmount).toFixed(6)} ${asset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(assetAmount, assetRate).toFixed(2)
            }}
          />
        </div>
      </div>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-fee" alt="Fee" /> {translate('CONFIRM_TX_FEE')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={baseAsset.uuid} size={'24px'} />
          <Amount
            fiatColor={COLORS.BLUE_SKY}
            assetValue={`${feeFormatted} ${baseAsset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(feeFormatted, baseAssetRate).toFixed(2)
            }}
          />
        </div>
      </div>

      <div className="TransactionReceipt-divider" />

      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-sent" alt="Sent" />
          {translate('TOTAL')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          {asset.type === 'base' ? (
            <Amount
              fiatColor={COLORS.BLUE_SKY}
              assetValue={`${totalEtherFormatted} ${asset.ticker}`}
              fiat={{
                symbol: getFiat(settings).symbol,
                ticker: getFiat(settings).ticker,
                amount: convertToFiat(totalEtherFormatted, assetRate).toFixed(2)
              }}
            />
          ) : (
            <Amount
              fiatColor={COLORS.BLUE_SKY}
              assetValue={`${assetAmount} ${asset.ticker}`}
              bold={true}
              baseAssetValue={`+ ${totalEtherFormatted} ${baseAsset.ticker}`}
              fiat={{
                symbol: getFiat(settings).symbol,
                ticker: getFiat(settings).ticker,
                amount: convertToFiat(assetAmount, assetRate)
                  .plus(convertToFiat(totalEtherFormatted, baseAssetRate))
                  .toFixed(2)
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
