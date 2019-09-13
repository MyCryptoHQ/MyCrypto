import React, { useState } from 'react';
import { Button, Network } from '@mycrypto/ui';
import { formatEther, bigNumberify } from 'ethers/utils';

import { Asset, ExtendedAccount, Network as INetwork } from 'v2/types';
import { baseToConvertedUnit, totalTxFeeToString } from 'v2/services/EthService';
import { getBalanceFromAccount } from 'v2/services/Store';
import { CopyableCodeBlock } from 'v2/components';

import './TransactionDetailsDisplay.scss';
import { ITxObject } from '../../types';

interface Props {
  baseAsset: Asset;
  asset: Asset;
  network: INetwork;
  nonce: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  senderAccount: ExtendedAccount;
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
    ? formatEther(bigNumberify(userAssetToSend.balance))
    : 'Unknown Balance';

  return (
    <>
      <div className="TransactionDetails">
        <div className="TransactionDetails-row">
          <div className="TransactionDetails-row-column">
            <Button
              basic={true}
              onClick={() => setShowDetails(!showDetails)}
              className="TransactionDetails-detailButton"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </div>
        {showDetails && (
          <div className="TransactionDetails-content">
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">{`Account Balance (${baseAsset.ticker}):`}</div>
              <div className="TransactionDetails-row-column">
                {`${formatEther(getBalanceFromAccount(senderAccount))}`}
              </div>
            </div>
            {asset.type === 'erc20' && (
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">{`Account Balance (${asset.ticker}):`}</div>
                <div className="TransactionDetails-row-column">{`${userAssetBalance}`}</div>
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
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Gas Price:</div>
              <div className="TransactionDetails-row-column">{`${baseToConvertedUnit(
                gasPrice,
                18
              )} ${baseAsset.ticker} (${baseToConvertedUnit(gasPrice, 9)} gwei)`}</div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Max TX Fee:</div>
              <div className="TransactionDetails-row-column">{`${maxTransactionFeeBase} ${baseAsset.ticker}`}</div>
            </div>
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Nonce:</div>
              <div className="TransactionDetails-row-column">{nonce}</div>
            </div>
            {data !== '0x0' && (
              <>
                <div className="TransactionDetails-row">
                  <div className="TransactionDetails-row-column">Data:</div>
                </div>
                <div className="TransactionDetails-row">
                  <div className="TransactionDetails-row-data">{data}</div>
                </div>
              </>
            )}
            {rawTransaction && (
              <>
                <div className="TransactionDetails-row">
                  <div className="TransactionDetails-row-column">Raw Transaction:</div>
                </div>
                <div className="TransactionDetails-row">
                  <div className="TransactionDetails-row-data">
                    <CopyableCodeBlock>{JSON.stringify(rawTransaction)}</CopyableCodeBlock>
                  </div>
                </div>
              </>
            )}
            {signedTransaction && (
              <>
                <div className="TransactionDetails-row">
                  <div className="TransactionDetails-row-column">Signed Transaction:</div>
                </div>
                <div className="TransactionDetails-row">
                  <div className="TransactionDetails-row-data">
                    <CopyableCodeBlock>{signedTransaction}></CopyableCodeBlock>
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
