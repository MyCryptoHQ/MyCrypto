import styled from 'styled-components';

import { Amount } from '@components';
import Icon from '@components/Icon';
import { getFiat } from '@config';
import { BREAK_POINTS, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ExtendedAsset, ISettings, ITxObject } from '@types';
import {
  bigify,
  bigNumValueToViewableEther,
  convertToFiat,
  fromWei,
  isType2Tx,
  totalTxFeeToWei,
  useScreenSize,
  Wei
} from '@utils';

import { TokenTransferTable } from './displays';
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
  transferEvents: ITxTransferEvent[];
  baseAsset: ExtendedAsset;
  settings: ISettings;
  gasUsed: string;
  value: string;
  rawTransaction: ITxObject;
  assetRate?: number;
  baseAssetRate?: number;
}

export const TxReceiptTotals = ({
  transferEvents,
  baseAsset,
  settings,
  gasUsed,
  value,
  rawTransaction,
  baseAssetRate
}: Props) => {
  const { isMobile } = useScreenSize();
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
      {transferEvents.filter((t) => t.asset.type === 'erc20').length > 0 && (
        <TokenTransferTable
          isMobile={isMobile}
          valueTransfers={transferEvents}
          settings={settings}
        />
      )}
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <SIcon type="tx-send" alt="Sent" />
          {translate('CONFIRM_TX_SENT')}
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Amount
            asset={{
              amount: bigify(bigNumValueToViewableEther(value).toString()).toFixed(5),
              ticker: baseAsset.ticker,
              uuid: baseAsset.uuid,
              type: 'base'
            }}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
              amount: convertToFiat(
                bigNumValueToViewableEther(value).toString(),
                baseAssetRate
              ).toFixed(2)
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
              uuid: baseAsset.uuid,
              type: 'base'
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
          {translateRaw('TOTAL')}:
        </div>
        <div className="TransactionReceipt-row-column rightAligned">
          <Amount
            asset={{
              amount: totalEtherFormatted,
              ticker: baseAsset.ticker,
              uuid: baseAsset.uuid,
              type: 'base'
            }}
            fiat={{
              symbol: fiat.symbol,
              ticker: fiat.ticker,
              amount: convertToFiat(totalEtherFormatted, baseAssetRate).toFixed(2)
            }}
          />
        </div>
      </div>
    </>
  );
};
