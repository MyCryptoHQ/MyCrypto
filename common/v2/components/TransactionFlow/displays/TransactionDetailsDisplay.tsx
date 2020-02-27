import React, { useState, useContext } from 'react';
import { Network } from '@mycrypto/ui';
import { bigNumberify } from 'ethers/utils';

import { Asset, StoreAccount, Network as INetwork, ITxObject } from 'v2/types';
import { baseToConvertedUnit, totalTxFeeToString } from 'v2/services/EthService';
import { getAccountBalance } from 'v2/services/Store';
import { CopyableCodeBlock, Button } from 'v2/components';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { weiToFloat, isTransactionDataEmpty } from 'v2/utils';
import translate from 'v2/translations';
import { COLORS } from 'v2/theme';

import './TransactionDetailsDisplay.scss';

const { BLUE_BRIGHT } = COLORS;

interface Props {
  baseAsset: Asset;
  asset: Asset;
  network: INetwork;
  nonce: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  senderAccount: StoreAccount;
  rawTransaction?: ITxObject;
  signedTransaction?: string;
}

function TransactionDetailsDisplay({
  baseAsset,
  asset,
  network,
  nonce,
  data,
  senderAccount,
  gasLimit,
  gasPrice,
  rawTransaction,
  signedTransaction
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);
  const networkName = network ? network.name : undefined;
  const userAssetToSend = senderAccount.assets.find(accountAsset => {
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
            <Button
              basic={true}
              color={BLUE_BRIGHT}
              onClick={() => setShowDetails(!showDetails)}
              className="TransactionDetails-detailButton"
            >
              {showDetails ? '- Hide' : '+ See More'} {translate('ACTION_8')}
            </Button>
          </div>
        </div>
        {showDetails && (
          <div className="TransactionDetails-content">
            {baseAsset && senderAccount.uuid && (
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">
                  {`Account Balance (${baseAsset.ticker}):`}
                </div>
                <div className="TransactionDetails-row-column">{`
                  ${weiToFloat(
                    getAccountBalance(senderAccount)
                  ).toFixed(6)}
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
                <Network color="blue">{networkName}</Network>
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
