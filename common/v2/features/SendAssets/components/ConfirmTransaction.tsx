import React, { useContext, useState } from 'react';
import { Address, Button, Network } from '@mycrypto/ui';

import feeIcon from 'common/assets/images/icn-fee.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import { AddressBookContext, getNetworkByChainId, AccountContext } from 'v2/services/Store';
import { Amount } from 'v2/components';

import { IStepComponentProps } from '../types';
import './ConfirmTransaction.scss';
import {
  gasPriceToBase,
  fromWei,
  Wei,
  toWei,
  getDecimalFromEtherUnit,
  fromTokenBase
} from 'v2/services/EthService/utils/units';
import BN from 'bn.js';
import { stripHexPrefix } from 'v2/services/EthService';
import { decodeTransaction } from '../helpers';
import { getAssetByContractAndNetwork } from 'v2/services/Store/Asset/helpers';
import { decodeTransfer } from 'v2/services/EthService/contracts/token';
import { ExtendedAccount, Network as NetworkType, Asset } from 'v2/types';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

/*
  Confirm should only display values! There are no data transformations.
  The currentPath in SendAssets determines which action should be called.
*/

export interface IConfirmConfig {
  amount: string; // '0.01'
  asset: Asset; // {} as Asset
  chainId: number; // 1
  data: string; // '0x0'
  gasLimit: string; // '21000'
  gasPrice: string; // '100000000'
  network: NetworkType | undefined; // {} as Network
  nonce: string; // '13'
  receiverAddress: string; // '0xc7bFC8A6bD4e52bFE901764143abeF76Caf2f912'
  senderAccount: ExtendedAccount | undefined; // {} as ExtendedAccount
  to: string; // '0xc7bFC8A6bD4e52bFE901764143abeF76Caf2f912'
  value: string; // '0.00'
  from: string; // '0xc7bFC8A6bD4e52bFE901764143abeF76Caf2f912'
}

export default function ConfirmTransaction({
  txConfig,
  signedTx,
  onComplete
}: IStepComponentProps) {
  const { getAccountByAddressAndNetworkName } = useContext(AccountContext);
  const { getContactByAddress } = useContext(AddressBookContext);
  const [showDetails, setShowDetails] = useState(false);

  let confirmTransactionConfig: IConfirmConfig = {} as IConfirmConfig;
  const web3Flow = signedTx === null;

  if (web3Flow) {
    confirmTransactionConfig = {
      ...txConfig,
      from: txConfig.senderAccount.address,
      amount: txConfig.amount, //fromTokenBase(toWei(txConfig.amount, 0), txConfig.asset.decimal || 18),
      nonce: parseInt(stripHexPrefix(txConfig.nonce), 16).toString(),
      gasPrice: parseInt(stripHexPrefix(txConfig.gasPrice), 16).toString(),
      gasLimit: parseInt(stripHexPrefix(txConfig.gasLimit), 16).toString(),
      value: Wei(txConfig.value).toString()
    };
  } else if (signedTx) {
    const decodedTx = decodeTransaction(signedTx);
    const networkDetected = getNetworkByChainId(decodedTx.chainId);
    const contractAsset = getAssetByContractAndNetwork(decodedTx.to || undefined, networkDetected);

    confirmTransactionConfig = {
      ...decodedTx,
      to: decodedTx.to || 'Unknown',
      from: decodedTx.from || 'Unknown',
      receiverAddress: contractAsset ? decodeTransfer(decodedTx.data)._to : decodedTx.to,
      amount: contractAsset
        ? fromTokenBase(
            toWei(decodeTransfer(decodedTx.data)._value, 0),
            contractAsset.decimal || 18
          )
        : decodedTx.value,
      network: networkDetected || undefined,
      value: toWei(decodedTx.value, getDecimalFromEtherUnit('ether')).toString(),
      asset: contractAsset || txConfig.asset,
      senderAccount: getAccountByAddressAndNetworkName(
        decodedTx.from || undefined,
        networkDetected ? networkDetected.name : undefined
      ),
      gasPrice: gasPriceToBase(parseInt(decodedTx.gasPrice, 10)).toString(),
      nonce: decodedTx.nonce.toString()
    };
  }

  const recipientAccount = getContactByAddress(confirmTransactionConfig.to);
  const recipientLabel = recipientAccount ? recipientAccount.label : 'Unknown Address';

  /* ToDo: Figure out how to extract this */
  const {
    asset,
    gasPrice,
    gasLimit,
    value,
    amount,
    senderAccount,
    receiverAddress,
    network,
    nonce,
    data
  } = confirmTransactionConfig;
  const assetType = asset.type;
  const gasPriceActual = parseInt(gasPrice, 10);
  const gasLimitActual = parseInt(gasLimit, 10);

  /* Calculate Transaction Fee */
  const transactionFeeWei: BN = new BN(gasPriceActual * gasLimitActual);
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(6);
  const maxCostFeeEther = transactionFeeBase;

  /* Calculate total base asset amount */
  const valueWei = Wei(value);
  const totalEtherEgress = parseFloat(fromWei(valueWei.add(transactionFeeWei), 'ether')).toFixed(6); // @TODO: BN math, add amount + maxCost !In same symbol
  const networkName = network ? network.name : undefined;
  return (
    <div className="ConfirmTransaction">
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          To:
          <div className="ConfirmTransaction-addressWrapper">
            <Address
              address={receiverAddress || 'Unknown'}
              title={recipientLabel}
              truncate={truncate}
            />
          </div>
        </div>
        <div className="ConfirmTransaction-row-column">
          From:
          <div className="ConfirmTransaction-addressWrapper">
            <Address
              address={senderAccount ? senderAccount.address : 'Unknown'}
              title={senderAccount && senderAccount.label ? senderAccount.label : 'Unknown'}
              truncate={truncate}
            />
          </div>
        </div>
      </div>
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <img src={sendIcon} alt="Send" /> Send Amount:
        </div>
        <div className="ConfirmTransaction-row-column">
          <Amount assetValue={`${amount} ${asset.ticker}`} fiatValue="$1" />
        </div>
      </div>
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <img src={feeIcon} alt="Fee" /> Transaction Fee:
        </div>
        <div className="ConfirmTransaction-row-column">
          <Amount assetValue={`${maxCostFeeEther} ETH`} fiatValue="$1" />
        </div>
      </div>
      <div className="ConfirmTransaction-divider" />
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <img src={sendIcon} alt="Total" /> You'll Send:
        </div>
        <div className="ConfirmTransaction-row-column">
          {assetType === 'base' ? (
            <Amount assetValue={`${totalEtherEgress} ${asset.ticker}`} fiatValue="$1" />
          ) : (
            <Amount
              assetValue={`${amount} ${asset.ticker} + ${totalEtherEgress} ETH`}
              fiatValue="$1"
            />
          )}
        </div>
      </div>
      <Button
        basic={true}
        onClick={() => setShowDetails(!showDetails)}
        className="ConfirmTransaction-detailButton"
      >
        {showDetails ? 'Hide' : 'Show'} Details
      </Button>
      {showDetails && (
        <div className="ConfirmTransaction-details">
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Account Balance:</div>
            <div className="ConfirmTransaction-details-row-column">
              ${senderAccount ? senderAccount.balance : 'Unknown'} ETH
            </div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Network:</div>
            <div className="ConfirmTransaction-details-row-column">
              <Network color="blue">{networkName}</Network>
            </div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Gas Limit:</div>
            <div className="ConfirmTransaction-details-row-column">{`${gasLimitActual}`}</div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Gas Price:</div>
            <div className="ConfirmTransaction-details-row-column">{`${gasPriceActual} wei`}</div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Max TX Fee:</div>
            <div className="ConfirmTransaction-details-row-column">{maxCostFeeEther} ETH</div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Nonce:</div>
            <div className="ConfirmTransaction-details-row-column">{nonce}</div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Data:</div>
            <div className="ConfirmTransaction-details-row-column">{data}</div>
          </div>
        </div>
      )}
      <Button onClick={onComplete} className="ConfirmTransaction-button">
        Confirm and Send
      </Button>
    </div>
  );
}
