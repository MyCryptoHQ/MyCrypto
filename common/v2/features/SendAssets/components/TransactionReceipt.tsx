import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Address, Button, Copyable } from '@mycrypto/ui';

import { Amount, TimeElapsedCounter } from 'v2/components';
import { AddressBookContext } from 'v2/services/Store';
import {
  ProviderHandler,
  getTimestampFromBlockNum,
  getStatusFromHash
} from 'v2/services/EthService';

import { IStepComponentProps } from '../types';
import './TransactionReceipt.scss';
// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

export default function TransactionReceipt({ txReceipt, txConfig }: IStepComponentProps) {
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const [txStatus, setTxStatus] = useState({ status: false, known: false });
  const [timestamp, setTimestamp] = useState(0);

  if (!txReceipt) {
    return <div>Tx Receipt could not be found.</div>;
  }
  useEffect(() => {
    const provider = new ProviderHandler(txReceipt.network);
    if (timestamp === 0) {
      getTimestampFromBlockNum(txReceipt.blockNumber, provider).then(transactionTimestamp => {
        setTimestamp(transactionTimestamp || 0);
      });
    }
    if (!txStatus.known) {
      getStatusFromHash(txReceipt.hash, provider).then(transactionStatus => {
        setTxStatus(prevState => ({
          status: transactionStatus || prevState.status,
          known: transactionStatus !== undefined ? true : false
        }));
      });
    }
  });

  const recipientContact = getContactByAddressAndNetwork(
    txConfig.receiverAddress,
    txConfig.network
  );
  const recipientLabel = recipientContact ? recipientContact.label : 'Unknown Address';

  /* ToDo: Figure out how to extract this */
  const { asset, gasPrice, gasLimit, senderAccount, network, data, nonce, baseAsset } = txConfig;

  /* Determing User's Contact */
  const senderContact = getContactByAccount(senderAccount);
  const senderAccountLabel = senderContact ? senderContact.label : 'Unknown Account';

  const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();
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
          <div className="TransactionReceipt-details-row-column">Transaction Status:</div>
          <div className="TransactionReceipt-details-row-column">
            {txStatus.known ? (txStatus.status ? 'Success' : 'Fail') : 'Unknown'}
          </div>
        </div>

        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">Timestamp:</div>
          <div className="TransactionReceipt-details-row-column">
            {timestamp !== 0 ? (
              <div>
                <TimeElapsedCounter timestamp={timestamp} isSeconds={true} />
                <br /> {localTimestamp}
              </div>
            ) : (
              'Unknown'
            )}
          </div>
        </div>

        <TransactionDetailsDisplay
          baseAsset={baseAsset}
          asset={asset}
          data={data}
          network={network}
          senderAccount={senderAccount}
          gasLimit={gasLimit}
          gasPrice={gasPrice}
          nonce={nonce}
        />
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
