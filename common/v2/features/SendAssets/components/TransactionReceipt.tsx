import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Address, Button, Copyable, Network } from '@mycrypto/ui';

import { Amount } from 'v2/components';
import { AddressBookContext } from 'v2/services/Store';
import { totalTxFeeToString, baseToConvertedUnit } from 'v2/services/EthService';

import { IStepComponentProps } from '../types';
import './TransactionReceipt.scss';
// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default function TransactionReceipt({ txReceipt, txConfig }: IStepComponentProps) {
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const [showDetails, setShowDetails] = useState(false);
  if (!txReceipt) {
    return <div>Tx Receipt could not be found.</div>;
  }
  const timestamp = txReceipt.blockNumber;

  const recipientContact = getContactByAddressAndNetwork(
    txConfig.receiverAddress,
    txConfig.network
  );
  const recipientLabel = recipientContact ? recipientContact.label : 'Unknown Address';

  /* ToDo: Figure out how to extract this */
  const { asset, gasPrice, gasLimit, senderAccount, network, nonce, data, baseAsset } = txConfig;
  const assetType = asset.type;

  /* Calculate Transaction Fee */
  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);
  const networkName = network ? network.name : undefined;

  const userAssetToSend = senderAccount.assets.find(
    accountAsset => accountAsset.uuid === asset.uuid
  );
  const userAssetBalance = userAssetToSend ? userAssetToSend.balance : 'Unknown Balance';

  /* Determing User's Contact */
  const senderContact = getContactByAccount(senderAccount);
  const senderAccountLabel = senderContact ? senderContact.label : 'Unknown Account';

  return (
    <div className="TransactionReceipt">
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          To:
          <div className="TransactionReceipt-addressWrapper">
            <Address address={txReceipt.to} title={recipientLabel} truncate={truncate} />
          </div>
        </div>
        <div className="TransactionReceipt-row-column">
          From:
          <div className="TransactionReceipt-addressWrapper">
            <Address address={txReceipt.from} title={senderAccountLabel} truncate={truncate} />
          </div>
        </div>
      </div>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <img src={sentIcon} alt="Sent" /> You Sent:
        </div>
        <div className="TransactionReceipt-row-column">
          <Amount
            assetValue={`${txReceipt.amount} ${txReceipt.asset ? txReceipt.asset.ticker : 'ETH'}`}
            fiatValue="$250"
          />
        </div>
      </div>
      <div className="TransactionReceipt-divider" />
      <div className="TransactionReceipt-details">
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Transaction ID:</div>
          <div className="TransactionReceipt-details-row-column">
            <Copyable text={txReceipt.hash} truncate={truncate} />
          </div>
        </div>
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Receipt Status:</div>
          <div className="TransactionReceipt-details-row-column">Success</div>
        </div>
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Timestamp:</div>
          <div className="TransactionReceipt-details-row-column">
            1 minute ago <br />({timestamp})
          </div>
        </div>
        <Button
          basic={true}
          onClick={() => setShowDetails(!showDetails)}
          className="TransactionReceipt-detailButton"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
        {showDetails && (
          <div className="ConfirmTransaction-details">
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Current Account Balance:</div>
              <div className="ConfirmTransaction-details-row-column">
                {assetType === 'erc20' && (
                  <>
                    {' '}
                    {userAssetBalance} {asset.ticker} <br />{' '}
                  </>
                )}
                {`${senderAccount ? senderAccount.balance : 'Unknown'} ${baseAsset.ticker}`}
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
              <div className="ConfirmTransaction-details-row-column">{`${gasLimit}`}</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Gas Price:</div>
              <div className="ConfirmTransaction-details-row-column">{`${baseToConvertedUnit(
                gasPrice,
                18
              )} ${baseAsset.ticker} (${baseToConvertedUnit(gasPrice, 9)} gwei)`}</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Max TX Fee:</div>
              <div className="ConfirmTransaction-details-row-column">{`${maxTransactionFeeBase} ${baseAsset.ticker}`}</div>
            </div>
            <div className="ConfirmTransaction-details-row">
              <div className="ConfirmTransaction-details-row-column">Nonce:</div>
              <div className="ConfirmTransaction-details-row-column">{nonce}</div>
            </div>
            {data !== '0x0' && (
              <div className="ConfirmTransaction-details-row">
                <div className="ConfirmTransaction-details-row-column">Data:</div>
                <div className="ConfirmTransaction-details-row-column">
                  <span className="ConfirmTransaction-details-row-data">{data}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Link to="/dashboard">
        <Button className="TransactionReceipt-back">Back to Dashboard</Button>
      </Link>
      <Button secondary={true} className="TransactionReceipt-another">
        Send Another Transaction
      </Button>
    </div>
  );
}
