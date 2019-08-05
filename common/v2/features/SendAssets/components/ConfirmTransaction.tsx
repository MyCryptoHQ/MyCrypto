import React, { useContext, useState } from 'react';
import { Address, Button, Network } from '@mycrypto/ui';

import feeIcon from 'common/assets/images/icn-fee.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import { AddressBookContext, getNetworkByChainId } from 'v2/services/Store';
import { Amount } from 'v2/components';

import { IStepComponentProps } from '../types';
import './ConfirmTransaction.scss';
import {
  gasPriceToBase,
  fromWei,
  Wei,
  toWei,
  getDecimalFromEtherUnit
} from 'v2/services/EthService/utils/units';
import BN from 'bn.js';
import { stripHexPrefix } from 'v2/services/EthService';
import { decodeTransaction } from '../helpers';
import { getAssetByContractAndNetwork } from 'v2/services/Store/Asset/helpers';
import { decodeTransfer } from 'v2/services/EthService/contracts/token';
import { getAccountByAddressAndNetworkName } from 'v2/services/Store/Account/helpers';
import { isHexPrefixed } from 'ethereumjs-util';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

/*
  Confirm should only display values! There are no data transformations.
  The currentPath in SendAssets determines which action should be called.
*/

export default function ConfirmTransaction({
  txConfig,
  signedTx,
  onComplete
}: IStepComponentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { getContactByAddress } = useContext(AddressBookContext);
  let receiverAddress;
  let senderAccount;
  let amount;
  let gasLimit;
  let gasPrice;
  let nonce;
  let data;
  let network;
  let value;
  let asset;
  /* If signed transaction exists, this is not a web3 flow */
  if (signedTx) {
    const decodedTx = decodeTransaction(signedTx);
    const to = decodedTx.to;
    const networkDetected = getNetworkByChainId(decodedTx.chainId);
    if (to && networkDetected) {
      gasLimit = decodedTx.gasLimit;
      gasPrice = decodedTx.gasPrice;
      nonce = decodedTx.nonce;
      data = decodedTx.data;
      senderAccount = getAccountByAddressAndNetworkName(
        decodedTx.from || undefined,
        networkDetected.name
      );
      const contractAsset = getAssetByContractAndNetwork(to, networkDetected);
      receiverAddress = contractAsset ? decodeTransfer(data)._to : decodedTx.to;
      amount = contractAsset ? decodeTransfer(data)._value : decodedTx.value;
      network = networkDetected;
      value = contractAsset ? decodedTx.value : decodedTx.value;
      asset = contractAsset ? contractAsset : txConfig.asset;
    } else {
      return <div>Network for this asset could not be determined</div>; // ToDo: Figure out correct error messaging
    }
  } else {
    receiverAddress = txConfig.receiverAddress;
    senderAccount = txConfig.senderAccount;
    amount = txConfig.amount;
    gasLimit = txConfig.gasLimit;
    gasPrice = txConfig.gasPrice;
    nonce = txConfig.nonce;
    data = txConfig.data;
    network = txConfig.network;
    value = txConfig.value;
    asset = txConfig.asset;
  }
  /* ToDo: Figure out how to extract this */
  const assetType = asset.type;
  const gasPriceActual = isHexPrefixed(gasPrice) // number (wei)
    ? parseInt(stripHexPrefix(gasPrice), 16) // '0x9' gwei: string
    : parseFloat(gasPriceToBase(parseFloat(gasPrice)).toString()); // '9' gwei : string
  const gasLimitActual = isHexPrefixed(gasLimit) // number (wei)
    ? parseInt(stripHexPrefix(gasLimit), 16) // '0x5208' : string
    : parseInt(gasLimit, 10); // '21000' : string
  const recipientAccount = getContactByAddress(receiverAddress);
  const recipientLabel = recipientAccount ? recipientAccount.label : 'Unknown Address';

  /* Calculate Transaction Fee */
  const transactionFeeWei: BN = new BN(gasPriceActual * gasLimitActual);
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(6);
  const maxCostFeeEther = transactionFeeBase;

  /* Calculate total base asset amount */
  const valueWei = isHexPrefixed(value)
    ? Wei(value)
    : toWei(value, getDecimalFromEtherUnit('ether'));
  const totalEtherEgress = parseFloat(fromWei(valueWei.add(transactionFeeWei), 'ether')).toFixed(6); // @TODO: BN math, add amount + maxCost !In same symbol
  const { name: networkName } = network;

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
            <div className="ConfirmTransaction-details-row-column">{`${gasPriceActual} gwei`}</div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Max TX Fee:</div>
            <div className="ConfirmTransaction-details-row-column">{maxCostFeeEther} ETH</div>
          </div>
          <div className="ConfirmTransaction-details-row">
            <div className="ConfirmTransaction-details-row-column">Nonce:</div>
            <div className="ConfirmTransaction-details-row-column">
              {typeof nonce === 'string'
                ? parseInt(stripHexPrefix(nonce), 10).toString()
                : nonce.toString()}
            </div>
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
