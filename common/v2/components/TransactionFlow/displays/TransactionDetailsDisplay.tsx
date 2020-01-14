import React, { useState, useContext } from 'react';
import { Button, Network } from '@mycrypto/ui';
import { bigNumberify } from 'ethers/utils';

import { Asset, StoreAccount, ExtendedAccount, Network as INetwork, ITxObject } from 'v2/types';
import { baseToConvertedUnit, totalTxFeeToString } from 'v2/services/EthService';
import { getAccountBalance, StoreContext } from 'v2/services/Store';
import { CopyableCodeBlock } from 'v2/components';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { weiToFloat } from 'v2/utils';

import './TransactionDetailsDisplay.scss';
import translate from 'v2/translations';

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
  const { getAccount } = useContext(StoreContext);

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
                    getAccountBalance(getAccount(senderAccount) as StoreAccount)
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
            {data !== '0x0' && (
              <>
                <div className="TransactionDetails-row stacked">
                  <div className="TransactionDetails-row-column">Data:</div>
                  <div className="TransactionDetails-row-data">{data}</div>
                </div>
              </>
            )}
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
