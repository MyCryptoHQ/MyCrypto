import React from 'react';

import feeIcon from '@assets/images/icn-fee.svg';
import sendIcon from '@assets/images/icn-send.svg';
import sentIcon from '@assets/images/icn-sent.svg';
import { Amount, AssetIcon } from '@components';
import { getFiat } from '@config/fiats';
import translate from '@translations';
import { ExtendedAsset, ISettings } from '@types';
import { convertToFiat, fromWei, totalTxFeeToWei, Wei } from '@utils';

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

  const feeFormatted = parseFloat(fromWei(feeWei, 'ether')).toFixed(6);

  const valueWei = Wei(value);

  const totalWei = feeWei.add(valueWei);

  const totalFormatted = parseFloat(fromWei(totalWei, 'ether')).toFixed(6);

  /** @todo solve showing both token and base asset total */

  return (
    <>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <img src={sendIcon} alt="Sent" />
          {translate('CONFIRM_TX_SENT')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          <Amount
            assetValue={`${parseFloat(assetAmount).toFixed(6)} ${asset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(parseFloat(assetAmount), assetRate).toFixed(2)
            }}
          />
        </div>
      </div>

      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <img src={feeIcon} alt="Fee" /> {translate('CONFIRM_TX_FEE')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          <Amount
            assetValue={`${feeFormatted} ${baseAsset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(parseFloat(feeFormatted), baseAssetRate).toFixed(2)
            }}
          />
        </div>
      </div>

      <div className="TransactionReceipt-divider" />

      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <img src={sentIcon} alt="Sent" />
          {translate('TOTAL')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <AssetIcon uuid={asset.uuid} size={'24px'} />
          <Amount
            assetValue={`${totalFormatted} ${asset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(parseFloat(totalFormatted), assetRate).toFixed(2)
            }}
          />
        </div>
      </div>
    </>
  );
};
