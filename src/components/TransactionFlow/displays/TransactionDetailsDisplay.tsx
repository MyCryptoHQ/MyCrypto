import { useState } from 'react';

import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { Button, Network as UINetwork } from '@mycrypto/ui';
import styled from 'styled-components';

import { CopyableCodeBlock, EthAddress } from '@components';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, Fiat, ITxObject, ITxStatus, Network, TAddress } from '@types';
import {
  bigify,
  calculateGasUsedPercentage,
  convertToFiat,
  fromWei,
  isLegacyTx,
  isTransactionDataEmpty,
  isType2Tx,
  isTypedTx,
  totalTxFeeToString,
  toWei,
  Wei,
  weiToFloat
} from '@utils';

import { TxReceiptStatusBadge } from '../TxReceiptStatusBadge';
import { ISender } from '../types';

import './TransactionDetailsDisplay.scss';

const { BLUE_BRIGHT } = COLORS;

interface Props {
  baseAsset: Asset;
  asset: Asset;
  assetAmount: string;
  value: string;
  nonce: string;
  data: string;
  confirmations?: number;
  gasUsed?: BigNumber;
  gasLimit: string;
  rawTransaction: ITxObject;
  signedTransaction?: string;
  sender: ISender;
  fiat: Fiat;
  baseAssetRate: number | undefined;
  assetRate: number | undefined;
  status?: ITxStatus;
  timestamp?: number;
  recipient?: TAddress;
  network: Network;
}

const SeeMoreDetailsButton = styled(Button)`
  width: 100%;
  align-items: center;
  margin-bottom: 15px;
  color: #1eb8e7;
  font-weight: normal;
`;

function TransactionDetailsDisplay({
  baseAsset,
  asset,
  assetAmount,
  value,
  confirmations,
  gasUsed,
  nonce,
  data,
  gasLimit,
  rawTransaction,
  signedTransaction,
  sender,
  fiat,
  baseAssetRate,
  assetRate,
  status,
  timestamp,
  recipient,
  network
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const gasPrice = isType2Tx(rawTransaction)
    ? rawTransaction.maxFeePerGas
    : rawTransaction.gasPrice;

  const maxTxFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);
  const userAssetToSend = sender.assets.find((accountAsset) => {
    return accountAsset.uuid === asset.uuid;
  });
  const userAssetBalance = userAssetToSend
    ? weiToFloat(BigNumber.from(userAssetToSend.balance), asset.decimal).toFixed(6)
    : translateRaw('UNKNOWN_BALANCE');

  const gasUsedPercentage = gasUsed && calculateGasUsedPercentage(gasLimit, gasUsed.toString());

  const actualTxFeeBase = gasUsed && totalTxFeeToString(gasPrice, gasUsed.toString());

  const actualTxFeeFiat =
    actualTxFeeBase && convertToFiat(actualTxFeeBase, baseAssetRate).toFixed(2);

  const maxTxFeeFiat = convertToFiat(maxTxFeeBase, baseAssetRate).toFixed(2);

  const feeWei = toWei(actualTxFeeBase ? actualTxFeeBase : maxTxFeeBase, DEFAULT_ASSET_DECIMAL);

  const valueWei = Wei(value);

  const totalWei = feeWei.plus(valueWei);

  const totalEtherFormatted = bigify(fromWei(totalWei, 'ether')).toFixed(6);

  return (
    <>
      <div className="TransactionDetails">
        <div className="TransactionDetails-row">
          <div className="TransactionDetails-row-column">
            <SeeMoreDetailsButton
              basic={true}
              color={BLUE_BRIGHT}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? `${translateRaw('SEE_FEWER')}` : `${translateRaw('SEE_MORE')}`}{' '}
              {translate('ACTION_8')}
            </SeeMoreDetailsButton>
          </div>
        </div>
        {showDetails && (
          <div className="TransactionDetails-content">
            {status && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">{translateRaw('TX_STATUS')}:</div>
                <div className="TransactionDetails-row-column">
                  <TxReceiptStatusBadge status={status} />
                </div>
              </div>
            )}
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('TIMESTAMP')}:</div>
              <div className="TransactionDetails-row-column">
                {timestamp !== 0 && timestamp !== undefined
                  ? new Date(Math.floor(timestamp * 1000)).toLocaleString()
                  : translate('PENDING_STATE')}
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('X_SENDER')}:</div>
              <div className="TransactionDetails-row-column">
                <EthAddress address={sender.address} truncate={true} disableTooltip={true} />
              </div>
            </div>
            {recipient && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">{translateRaw('X_RECIPIENT')}:</div>
                <div className="TransactionDetails-row-column">
                  <EthAddress address={recipient} truncate={true} disableTooltip={true} />
                </div>
              </div>
            )}
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('SEND_AMOUNT')}:</div>
              <div className="TransactionDetails-row-column">{`${bigify(assetAmount).toFixed(6)} ${
                asset.ticker
              }`}</div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">
                {translateRaw('TRANSACTION_FEE')}:
              </div>
              <div className="TransactionDetails-row-column">
                {`${actualTxFeeBase ? actualTxFeeBase : maxTxFeeBase} ${baseAsset.ticker}`}
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">
                {translateRaw('CONFIRM_TX_SENT')}:
              </div>
              <div className="TransactionDetails-row-column">
                {asset.type === 'base'
                  ? `${totalEtherFormatted} ${baseAsset.ticker}`
                  : `${assetAmount} ${asset.ticker} + ${
                      actualTxFeeBase ? actualTxFeeBase : maxTxFeeBase
                    } ${baseAsset.ticker}`}
              </div>
            </div>
            {sender.accountBalance && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">
                  {translateRaw('ACCOUNT_BALANCE_WITH_TICKER', { $ticker: baseAsset.ticker })}
                </div>
                <div className="TransactionDetails-row-column">{`
                  ${weiToFloat(sender.accountBalance).toFixed(6)}
                  ${baseAsset.ticker}
                `}</div>
              </div>
            )}
            {asset.type === 'erc20' && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">
                  {translateRaw('ACCOUNT_BALANCE_WITH_TICKER', { $ticker: asset.ticker })}
                </div>
                <div className="TransactionDetails-row-column">{`
                  ${userAssetBalance}
                  ${asset.ticker}
                `}</div>
              </div>
            )}
            {baseAsset.uuid !== asset.uuid && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">
                  {translateRaw('BASE_ASSET_PRICE')}:
                </div>
                <div className="TransactionDetails-row-column">
                  {`${fiat.symbol}${baseAssetRate}/${baseAsset.ticker}`}
                </div>
              </div>
            )}
            <div className="TransactionDetails-row  border">
              <div className="TransactionDetails-row-column">{translateRaw('ASSET_PRICE')}:</div>
              <div className="TransactionDetails-row-column">
                {`${fiat.symbol}${assetRate}/${asset.ticker}`}
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('NETWORK')}:</div>
              <div className="TransactionDetails-row-column">
                <UINetwork color={network.color || 'blue'}>{network.name}</UINetwork>
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('CONFIRMATIONS')}:</div>
              <div className="TransactionDetails-row-column">
                {confirmations ? `${confirmations}` : translate('PENDING_STATE')}
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('GAS_LIMIT')}:</div>
              <div className="TransactionDetails-row-column">{`${bigify(gasLimit).toString(
                10
              )}`}</div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('GAS_USED')}:</div>
              <div className="TransactionDetails-row-column">
                {gasUsed
                  ? `${gasUsed.toString()} (${gasUsedPercentage?.toFixed(2)}%)`
                  : translate('PENDING_STATE')}
              </div>
            </div>
            {baseAsset && rawTransaction && isLegacyTx(rawTransaction) && rawTransaction.gasPrice && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">{translateRaw('GAS_PRICE')}:</div>
                <div className="TransactionDetails-row-column">{`
                  ${formatUnits(rawTransaction.gasPrice, 9)} gwei
                  (${formatUnits(rawTransaction.gasPrice, DEFAULT_ASSET_DECIMAL)} ${
                  baseAsset.ticker
                })
                `}</div>
              </div>
            )}
            {baseAsset &&
              rawTransaction &&
              isType2Tx(rawTransaction) &&
              rawTransaction.maxFeePerGas && (
                <div className="TransactionDetails-row border">
                  <div className="TransactionDetails-row-column">
                    {translateRaw('MAX_FEE_PER_GAS')}:
                  </div>
                  <div className="TransactionDetails-row-column">{`
                  ${formatUnits(rawTransaction.maxFeePerGas, 9)} gwei
                  (${formatUnits(rawTransaction.maxFeePerGas, DEFAULT_ASSET_DECIMAL)} ${
                    baseAsset.ticker
                  })
                `}</div>
                </div>
              )}
            {baseAsset &&
              rawTransaction &&
              isType2Tx(rawTransaction) &&
              rawTransaction.maxPriorityFeePerGas && (
                <div className="TransactionDetails-row border">
                  <div className="TransactionDetails-row-column">
                    {translateRaw('MAX_PRIORITY_FEE')}:
                  </div>
                  <div className="TransactionDetails-row-column">{`
                  ${formatUnits(rawTransaction.maxPriorityFeePerGas, 9)} gwei
                  (${formatUnits(rawTransaction.maxPriorityFeePerGas, DEFAULT_ASSET_DECIMAL)} ${
                    baseAsset.ticker
                  })
                `}</div>
                </div>
              )}
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">
                {translateRaw('TRANSACTION_FEE')}:
              </div>
              <div className="TransactionDetails-row-column">
                {actualTxFeeBase
                  ? `${actualTxFeeBase} ${baseAsset.ticker} (${fiat.symbol}${actualTxFeeFiat})`
                  : translate('PENDING_STATE')}
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('MAX_TX_FEE')}:</div>
              <div className="TransactionDetails-row-column">
                {`${maxTxFeeBase} ${baseAsset.ticker} (${fiat.symbol}${maxTxFeeFiat})`}
              </div>
            </div>
            <div className="TransactionDetails-row border">
              <div className="TransactionDetails-row-column">{translateRaw('NONCE')}:</div>
              <div className="TransactionDetails-row-column">{bigify(nonce).toString(10)}</div>
            </div>
            <div
              className={`TransactionDetails-row border ${
                !isTransactionDataEmpty(data) && `stacked`
              }`}
            >
              <div className="TransactionDetails-row-column">{translateRaw('DATA')}:</div>
              {!isTransactionDataEmpty(data) ? (
                <div className="TransactionDetails-row-data">
                  <CopyableCodeBlock>{data}</CopyableCodeBlock>
                </div>
              ) : (
                <div className="TransactionDetails-row-data-empty">
                  {translate('TRANS_DATA_NONE')}
                </div>
              )}
            </div>
            {isTypedTx(rawTransaction) && (
              <div className="TransactionDetails-row border">
                <div className="TransactionDetails-row-column">{translateRaw('TX_TYPE')}:</div>
                <div className="TransactionDetails-row-column">
                  {rawTransaction.type.toString(10)}
                </div>
              </div>
            )}
            {rawTransaction && (
              <>
                <div className="TransactionDetails-row border stacked">
                  <div className="TransactionDetails-row-column">
                    {translateRaw('RAW_TRANSACTION')}:
                  </div>
                  <div className="TransactionDetails-row-data">
                    <CopyableCodeBlock>{JSON.stringify(rawTransaction)}</CopyableCodeBlock>
                  </div>
                </div>
              </>
            )}
            {signedTransaction && (
              <>
                <div className="TransactionDetails-row border stacked">
                  <div className="TransactionDetails-row-column">
                    {translateRaw('SIGNED_TRANSACTION')}:
                  </div>
                  <div className="TransactionDetails-row-data">
                    <CopyableCodeBlock>{signedTransaction}</CopyableCodeBlock>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default TransactionDetailsDisplay;
