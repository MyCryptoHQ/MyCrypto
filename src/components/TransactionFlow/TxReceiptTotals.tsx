import styled from 'styled-components';

import { Amount } from '@components';
import Icon from '@components/Icon';
import { getFiat } from '@config';
import { BREAK_POINTS, SPACING } from '@theme';
import translate from '@translations';
import { ExtendedAsset, ISettings, ITxObject } from '@types';
import { bigify, convertToFiat, fromWei, isType2Tx, totalTxFeeToWei, Wei } from '@utils';

const SIcon = styled(Icon)`
  height: 25px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;
interface Props {
  asset: ExtendedAsset;
  assetAmount: string;
  baseAsset: ExtendedAsset;
  settings: ISettings;
  gasUsed: string;
  value: string;
  rawTransaction: ITxObject;
  assetRate?: number;
  baseAssetRate?: number;
}

export const TxReceiptTotals = ({
  asset,
  assetAmount,
  baseAsset,
  settings,
  gasUsed,
  value,
  rawTransaction,
  assetRate,
  baseAssetRate
}: Props) => {
  const gasPrice = isType2Tx(rawTransaction)
    ? rawTransaction.maxFeePerGas
    : rawTransaction.gasPrice;

  const feeWei = totalTxFeeToWei(gasPrice, gasUsed);
  const feeFormatted = bigify(fromWei(feeWei, 'ether')).toFixed(6);
  const valueWei = Wei(value);
  const totalWei = feeWei.plus(valueWei);
  const totalEtherFormatted = bigify(fromWei(totalWei, 'ether')).toFixed(6);
  const fiat = getFiat(settings);

  return (
    <>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-send" alt="Sent" />
          {translate('CONFIRM_TX_SENT')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Amount
            asset={{
              amount: bigify(assetAmount).toFixed(6),
              ticker: asset.ticker,
              uuid: asset.uuid
            }}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
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
          <Amount
            asset={{
              amount: feeFormatted,
              ticker: baseAsset.ticker,
              uuid: baseAsset.uuid
            }}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
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
          {asset.type === 'base' ? (
            <Amount
              asset={{
                amount: totalEtherFormatted,
                ticker: asset.ticker,
                uuid: asset.uuid
              }}
              fiat={{
                symbol: fiat.symbol,
                ticker: fiat.ticker,
                amount: convertToFiat(totalEtherFormatted, assetRate).toFixed(2)
              }}
            />
          ) : (
            <Amount
              asset={{
                amount: assetAmount,
                ticker: asset.ticker,
                uuid: asset.uuid
              }}
              fiat={{
                symbol: fiat.symbol,
                ticker: fiat.ticker,
                amount: convertToFiat(assetAmount, assetRate)
                  .plus(convertToFiat(totalEtherFormatted, baseAssetRate))
                  .toFixed(2)
              }}
              bold={true}
              baseAssetValue={`+ ${totalEtherFormatted} ${baseAsset.ticker}`}
            />
          )}
        </div>
      </div>
    </>
  );
};
