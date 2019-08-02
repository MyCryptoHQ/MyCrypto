import React, { useContext, useState } from 'react';
import { Address, Button, Network } from '@mycrypto/ui';

import feeIcon from 'common/assets/images/icn-fee.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import { AddressBookContext } from 'v2/services/Store';
import { Amount } from 'v2/components';
import { Network as INetwork } from 'v2/types';

import { IStepComponentProps } from '../types';
import './ConfirmTransaction.scss';
import { gasPriceToBase, fromWei, Wei } from 'v2/services/EthService/utils/units';
import BN from 'bn.js';
import { isValidHex } from 'v2/services/EthService/validators';
import { stripHexPrefix } from 'v2/services/EthService';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

/*
  Confirm should only display values! There are no data transformations.
  The currentPath in SendAssets determines which action should be called.
*/

export default function ConfirmTransaction({ txConfig, onComplete }: IStepComponentProps) {
  const [showDetails, setShowDetails] = useState(false);
  const { getContactByAddress } = useContext(AddressBookContext);

  const {
    receiverAddress,
    senderAccount,
    amount,
    gasLimit,
    gasPrice,
    nonce,
    data,
    network,
    value,
    asset
  } = txConfig;

  const assetType = asset.type;
  const gasPriceActual = isValidHex(gasPrice)
    ? parseInt(stripHexPrefix(gasPrice), 16)
    : parseFloat(gasPriceToBase(parseFloat(gasPrice)).toString());
  const gasLimitActual = isValidHex(gasLimit)
    ? parseInt(stripHexPrefix(gasLimit), 16)
    : parseFloat(gasLimit);

  const recipientAccount = getContactByAddress(receiverAddress);
  const recipientLabel = recipientAccount ? recipientAccount.label : 'Unknown Address';

  /* Calculate Transaction Fee */
  const transactionFeeWei: BN = new BN(gasPriceActual * gasLimitActual);
  const transactionFeeBaseAdv: string = fromWei(transactionFeeWei, 'ether').toString();
  const transactionFeeBase: string = parseFloat(transactionFeeBaseAdv).toFixed(6);
  const maxCostFeeEther = transactionFeeBase;

  /* Calculate total base asset amount */
  const totalEtherEgress = parseFloat(fromWei(Wei(value).add(transactionFeeWei), 'ether')).toFixed(
    6
  ); // @TODO: BN math, add amount + maxCost !In same symbol
  const { name: networkName } = network as INetwork;

  return (
    <div className="ConfirmTransaction">
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          To:
          <div className="ConfirmTransaction-addressWrapper">
            <Address address={receiverAddress} title={recipientLabel} truncate={truncate} />
          </div>
        </div>
        <div className="ConfirmTransaction-row-column">
          From:
          <div className="ConfirmTransaction-addressWrapper">
            <Address
              address={senderAccount.address}
              title={senderAccount.label}
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
              ${senderAccount.balance} ETH
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
            <div className="ConfirmTransaction-details-row-column">{stripHexPrefix(nonce)}</div>
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
