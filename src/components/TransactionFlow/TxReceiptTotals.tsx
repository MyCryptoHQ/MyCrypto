import styled from 'styled-components';

import { Amount } from '@components';
import Icon from '@components/Icon';
import { getFiat } from '@config';
import { BREAK_POINTS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ExtendedAsset, ISettings, ITxObject } from '@types';
import { bigify, convertToFiat, fromWei, isSameAddress, isType2Tx, totalTxFeeToWei/*, Wei*/ } from '@utils';

import { ITxTransferEvent } from './TxReceipt';

const SIcon = styled(Icon)`
  height: 25px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

interface Props {
  valueTransfers: ITxTransferEvent[];
  baseAsset: ExtendedAsset;
  settings: ISettings;
  gasUsed: string;
  value: string;
  rawTransaction: ITxObject;
  assetRate?: number;
  baseAssetRate?: number;
}

export const TxReceiptTotals = ({
  valueTransfers,
  baseAsset,
  settings,
  gasUsed,
  //value,
  rawTransaction,
  //assetRate,
  baseAssetRate
}: Props) => {
  const gasPrice = isType2Tx(rawTransaction)
    ? rawTransaction.maxFeePerGas
    : rawTransaction.gasPrice;

  const feeWei = totalTxFeeToWei(gasPrice, gasUsed);
  const feeFormatted = bigify(fromWei(feeWei, 'ether')).toFixed(6);
  //const valueWei = Wei(value);
  //const totalWei = feeWei.plus(valueWei);
  //const totalEtherFormatted = bigify(fromWei(totalWei, 'ether')).toFixed(6);
  const fiat = getFiat(settings);

  return (
    <>
    {valueTransfers.filter(({ from }) => isSameAddress(from, rawTransaction.from)).map((transfer, idx) => (
      <div className="TransactionReceipt-row" key={idx}>
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-send" alt="Sent" />
          {translate('CONFIRM_TX_SENT')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Amount
            isNFTAsset={transfer.isNFTTransfer}
            asset={{
              amount: bigify(transfer.amount).toFixed(6),
              ticker: transfer.asset.ticker,
              uuid: transfer.asset.uuid
            }}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
              amount: convertToFiat(transfer.amount, transfer.rate).toFixed(2)
            }}
          />
        </div>
      </div>
    ))}
    {valueTransfers.filter(({ from }) => isSameAddress(from, rawTransaction.to)).map((transfer, idx) => (
      <div className="TransactionReceipt-row" key={idx}>
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-receive" alt="Sent" />
          {translateRaw('CONFIRM_TX_RECEIVED') /*@todo: fix*/}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Amount
            isNFTAsset={transfer.isNFTTransfer}
            asset={{
              amount: bigify(transfer.amount).toFixed(6),
              ticker: transfer.asset.ticker,
              uuid: transfer.asset.uuid
            }}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
              amount: convertToFiat(transfer.amount, transfer.rate).toFixed(2)
            }}
          />
        </div>
      </div>
    ))}
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-fee" alt="Fee" /> {translate('CONFIRM_TX_FEE')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Amount
            isNFTAsset={false}
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
          {'Total Sent' /* @todo: remove*/}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          {/*asset.type === 'base' ? (
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
            )*/}
        </div>
      </div>
    </>
  );
};
