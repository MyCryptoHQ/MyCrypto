import React, { useState } from 'react';
import { Button, Network } from '@mycrypto/ui';

import { Asset, ExtendedAccount, Network as INetwork } from 'v2/types';
import { baseToConvertedUnit, totalTxFeeToString } from 'v2/services/EthService';

import './TransactionDetailsDisplay.scss';

interface Props {
  baseAsset: Asset;
  asset: Asset;
  network: INetwork;
  nonce: string;
  data: string;
  gasLimit: string;
  gasPrice: string;
  senderAccount: ExtendedAccount;
}

function TransactionDetailsDisplay({
  baseAsset,
  asset,
  network,
  nonce,
  data,
  senderAccount,
  gasLimit,
  gasPrice
}: Props) {
  const [showDetails, setShowDetails] = useState(false);

  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);
  const networkName = network ? network.name : undefined;
  const userAssetToSend = senderAccount.assets.find(accountAsset => {
    return accountAsset.uuid === asset.uuid;
  });
  const userAssetBalance = userAssetToSend ? userAssetToSend.balance : 'Unknown Balance';
  return (
    <>
      <div className="TransactionDetails">
        <Button
          basic={true}
          onClick={() => setShowDetails(!showDetails)}
          className="TransactionDetails-detailButton"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
        {showDetails && (
          <div className="TransactionDetails-content">
            <div className="TransactionDetails-row">
              <div className="TransactionDetails-row-column">Current Account Balance:</div>
              <div className="TransactionDetails-row-column">
                {asset.type === 'erc20' && (
                  <>
                    {userAssetBalance} {asset.ticker} <br />
                  </>
                )}
                {`${senderAccount ? senderAccount.balance : 'Unknown'} ${baseAsset.ticker}`}
              </div>
            </div>
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
              <div className="TransactionDetails-row">
                <div className="TransactionDetails-row-column">Data:</div>
                <div className="TransactionDetails-row-column">
                  <div className="TransactionDetails-row-data">{data}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default TransactionDetailsDisplay;
