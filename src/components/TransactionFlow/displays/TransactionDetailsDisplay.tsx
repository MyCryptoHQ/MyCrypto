import React, { useState } from 'react';

import { Button, Network } from '@mycrypto/ui';
import { BigNumber, bigNumberify } from 'ethers/utils';
import styled from 'styled-components';


import { CopyableCodeBlock } from '@components';
import { DEFAULT_ASSET_DECIMAL } from '@config';
import { COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import { Asset, Fiat, ITxObject } from '@types';
import {
  baseToConvertedUnit,
  calculateGasUsedPercentage,
  convertToFiat,
  isTransactionDataEmpty,
  totalTxFeeToString,
  weiToFloat
} from '@utils';


import { ISender } from '../types';

import './TransactionDetailsDisplay.scss';

const { BLUE_BRIGHT } = COLORS;

interface Props {
  baseAsset: Asset;
  asset: Asset;
  nonce: string;
  data: string;
  confirmations?: number;
  gasUsed?: BigNumber;
  gasLimit: string;
  gasPrice: string;
  rawTransaction?: ITxObject;
  signedTransaction?: string;
  sender: ISender;
  fiat: Fiat;
  baseAssetRate: number | undefined;
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
  confirmations,
  gasUsed,
  nonce,
  data,
  gasLimit,
  gasPrice,
  rawTransaction,
  signedTransaction,
  sender,
  fiat,
  baseAssetRate
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const maxTxFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);
  const {
    network: { name: networkName, color: networkColor }
  } = sender;
  const userAssetToSend = sender.assets.find((accountAsset) => {
    return accountAsset.uuid === asset.uuid;
  });
  const userAssetBalance = userAssetToSend
    ? weiToFloat(bigNumberify(userAssetToSend.balance), asset.decimal).toFixed(6)
    : translateRaw('UNKNOWN_BALANCE');

  const gasUsedPercentage = gasUsed && calculateGasUsedPercentage(gasLimit, gasUsed.toString());

  const actualTxFeeBase = gasUsed && totalTxFeeToString(gasPrice, gasUsed.toString());

  const actualTxFeeFiat =
    actualTxFeeBase && convertToFiat(parseFloat(actualTxFeeBase), baseAssetRate).toFixed(2);

  const maxTxFeeFiat = convertToFiat(parseFloat(maxTxFeeBase), baseAssetRate).toFixed(2);

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
              {showDetails ? `- ${translateRaw('HIDE')}` : `+ ${translateRaw('SEE_MORE')}`}{' '}
              {translate('ACTION_8')}
            </SeeMoreDetailsButton>
          </div>
        </div>
        {showDetails && (
          <div className="TransactionDetails-content">
            {sender.accountBalance && (
              <div className="TransactionDetails-row">
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
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">
                  {translateRaw('ACCOUNT_BALANCE_WITH_TICKER', { $ticker: asset.ticker })}
                </div>
                <div className="TransactionDetails-row-column">{`
                  ${userAssetBalance}
                  ${asset.ticker}
                `}</div>
              </div>
            )}
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{translateRaw('NETWORK')}:</div>
              <div className="TransactionDetails-row-column">
                <Network color={networkColor || 'blue'}>{networkName}</Network>
              </div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{translateRaw('CONFIRMATIONS')}:</div>
              <div className="TransactionDetails-row-column">
                {confirmations ? `${confirmations}` : translate('UNKNOWN')}
              </div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{translateRaw('GAS_LIMIT')}:</div>
              <div className="TransactionDetails-row-column">{`${gasLimit}`}</div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{translateRaw('GAS_USED')}:</div>
              <div className="TransactionDetails-row-column">
                {gasUsed
                  ? `${gasUsed.toString()} (${gasUsedPercentage?.toFixed(2)}%)`
                  : translate('UNKNOWN')}
              </div>
            </div>
            {baseAsset && (
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">{translateRaw('GAS_PRICE')}:</div>
                <div className="TransactionDetails-row-column">{`
                  ${baseToConvertedUnit(gasPrice, 9)} gwei
                  (${baseToConvertedUnit(gasPrice, DEFAULT_ASSET_DECIMAL)} ${baseAsset.ticker})
                `}</div>
              </div>
            )}
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">
                {translateRaw('TRANSACTION_FEE')}:
              </div>
              <div className="TransactionDetails-row-column">
                {actualTxFeeBase
                  ? `${actualTxFeeBase} ${baseAsset.ticker} (${fiat.symbol}${actualTxFeeFiat})`
                  : translate('UNKNOWN')}
              </div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{translateRaw('MAX_TX_FEE')}:</div>
              <div className="TransactionDetails-row-column">
                {`${maxTxFeeBase} ${baseAsset.ticker} (${fiat.symbol}${maxTxFeeFiat})`}
              </div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{translateRaw('NONCE')}:</div>
              <div className="TransactionDetails-row-column">{nonce}</div>
            </div>
            <div className={`TransactionDetails-row ${!isTransactionDataEmpty(data) && `stacked`}`}>
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
            {rawTransaction && (
              <>
                <div className="TransactionDetails-row stacked">
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
                <div className="TransactionDetails-row stacked">
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
