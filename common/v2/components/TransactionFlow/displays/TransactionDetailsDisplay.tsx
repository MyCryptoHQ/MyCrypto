import React, { useState } from 'react';
import { Network, Button } from '@mycrypto/ui';
import { bigNumberify } from 'ethers/utils';
import styled from 'styled-components';

import { Asset, ITxObject } from 'v2/types';
import { baseToConvertedUnit, totalTxFeeToString } from 'v2/services/EthService';
import { CopyableCodeBlock } from 'v2/components';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { weiToFloat, isTransactionDataEmpty } from 'v2/utils';
import translate from 'v2/translations';
import { COLORS } from 'v2/theme';

import { ISender } from '../types';

import './TransactionDetailsDisplay.scss';

const { BLUE_BRIGHT } = COLORS;

interface Props {
  baseAsset: Asset;
  asset: Asset;
  nonce: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  rawTransaction?: ITxObject;
  signedTransaction?: string;
  sender: ISender;
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
  nonce,
  data,
  gasLimit,
  gasPrice,
  rawTransaction,
  signedTransaction,
  sender
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);
  const {
    network: { name: networkName, color: networkColor }
  } = sender;
  const userAssetToSend = sender.assets.find(accountAsset => {
    return accountAsset.uuid === asset.uuid;
  });
  const userAssetBalance = userAssetToSend
    ? weiToFloat(bigNumberify(userAssetToSend.balance), asset.decimal).toFixed(6)
    : 'Unknown Balance';

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
              {showDetails ? '- Hide' : '+ See More'} {translate('ACTION_8')}
            </SeeMoreDetailsButton>
          </div>
        </div>
        {showDetails && (
          <div className="TransactionDetails-content">
            {sender.accountBalance && (
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">
                  {`Account Balance (${baseAsset.ticker}):`}
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
                  {`Account Balance (${asset.ticker}):`}
                </div>
                <div className="TransactionDetails-row-column">{`
                  ${userAssetBalance}
                  ${asset.ticker}
                `}</div>
              </div>
            )}
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Network:</div>
              <div className="TransactionDetails-row-column">
                <Network color={networkColor || 'blue'}>{networkName}</Network>
              </div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Gas Limit:</div>
              <div className="TransactionDetails-row-column">{`${gasLimit}`}</div>
            </div>
            {baseAsset && (
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">Gas Price:</div>
                <div className="TransactionDetails-row-column">{`
                  ${baseToConvertedUnit(gasPrice, 9)} gwei
                  (${baseToConvertedUnit(gasPrice, DEFAULT_ASSET_DECIMAL)} ${baseAsset.ticker})
                `}</div>
              </div>
            )}
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Max TX Fee:</div>
              <div className="TransactionDetails-row-column">{`${maxTransactionFeeBase} ${baseAsset.ticker}`}</div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Nonce:</div>
              <div className="TransactionDetails-row-column">{nonce}</div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Data:</div>
              {!isTransactionDataEmpty(data) ? (
                <div className="TransactionDetails-row-data">{data}</div>
              ) : (
                <div className="TransactionDetails-row-data-empty">
                  {translate('TRANS_DATA_NONE')}
                </div>
              )}
            </div>
            {rawTransaction && (
              <>
                <div className="TransactionDetails-row stacked">
                  <div className="TransactionDetails-row-column">Raw Transaction:</div>
                  <div className="TransactionDetails-row-data">
                    <CopyableCodeBlock>{JSON.stringify(rawTransaction)}</CopyableCodeBlock>
                  </div>
                </div>
              </>
            )}
            {signedTransaction && (
              <>
                <div className="TransactionDetails-row stacked">
                  <div className="TransactionDetails-row-column">Signed Transaction:</div>
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
