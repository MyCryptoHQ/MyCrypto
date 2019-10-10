import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Address, Button, Copyable } from '@mycrypto/ui';

import { ITxReceipt, IStepComponentProps, TTicker } from 'v2/types';
import { Amount, TimeElapsedCounter } from 'v2/components';
import { AddressBookContext, AccountContext } from 'v2/services/Store';
import { RatesContext } from 'v2/services/RatesProvider';
import {
  ProviderHandler,
  getTimestampFromBlockNum,
  getTransactionReceiptFromHash
} from 'v2/services/EthService';

import './TransactionReceipt.scss';
// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import { fromTxReceiptObj } from './helpers';
import { translateRaw } from 'translations';
import { convertToFiat, truncate } from 'v2/utils';

export enum ITxStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

interface Props {
  completeButtonText: string;
}

export default function TransactionReceipt({
  txReceipt,
  txConfig,
  resetFlow,
  completeButtonText
}: IStepComponentProps & Props) {
  const { getRate } = useContext(RatesContext);
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const [txStatus, setTxStatus] = useState(ITxStatus.PENDING);
  const [displayTxReceipt, setDisplayTxReceipt] = useState(txReceipt as ITxReceipt);
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  if (!txReceipt) {
    return <div>Tx Receipt could not be found.</div>;
  }
  useEffect(() => {
    const provider = new ProviderHandler(displayTxReceipt.network || txConfig.network);
    if (blockNumber === 0 && txReceipt.hash) {
      const blockNumInterval = setInterval(() => {
        getTransactionReceiptFromHash(txReceipt.hash, provider).then(transactionOutcome => {
          if (!transactionOutcome) {
            return;
          }
          const transactionStatus =
            transactionOutcome.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
          setTxStatus(prevStatusState => transactionStatus || prevStatusState);
          setBlockNumber((prevState: number) => transactionOutcome.blockNumber || prevState);
          provider.getTransactionByHash(txReceipt.hash).then(transactionReceipt => {
            const receipt = fromTxReceiptObj(transactionReceipt) as ITxReceipt;
            addNewTransactionToAccount(senderAccount, receipt);
            setDisplayTxReceipt(receipt);
          });
        });
      }, 1000);
      return () => clearInterval(blockNumInterval);
    }
  });
  useEffect(() => {
    const provider = new ProviderHandler(displayTxReceipt.network || txConfig.network);
    if (timestamp === 0 && blockNumber !== 0) {
      const timestampInterval = setInterval(() => {
        getTimestampFromBlockNum(blockNumber, provider).then(transactionTimestamp => {
          setTimestamp(transactionTimestamp || 0);
        });
      }, 1000);

      return () => clearInterval(timestampInterval);
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
  const assetAmount = txReceipt.amount || txConfig.amount;
  const assetTicker = txReceipt.asset.ticker || txConfig.asset.ticker || 'ETH';
  return (
    <div className="TransactionReceipt">
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          To:
          <div className="TransactionReceipt-addressWrapper">
            <Address
              address={txReceipt.to || txConfig.receiverAddress}
              title={recipientLabel}
              truncate={truncate}
            />
          </div>
        </div>
        <div className="TransactionReceipt-row-column">
          From:
          <div className="TransactionReceipt-addressWrapper">
            <Address
              address={txReceipt.from || txConfig.senderAccount.address}
              title={senderAccountLabel}
              truncate={truncate}
            />
          </div>
        </div>
      </div>
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-column">
          <img src={sentIcon} alt="Sent" /> You Sent:
        </div>
        <div className="TransactionReceipt-row-column">
          <Amount
            assetValue={`${parseFloat(assetAmount).toFixed(6)} ${assetTicker}`}
            fiatValue={`$${convertToFiat(
              parseFloat(assetAmount),
              getRate(assetTicker as TTicker)
            ).toFixed(2)}
            `}
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
          <div className="TransactionReceipt-details-row-column">{translateRaw(txStatus)}</div>
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
          rawTransaction={txConfig.rawTransaction}
        />
      </div>
      <Link to="/dashboard">
        <Button className="TransactionReceipt-back">Back to Dashboard</Button>
      </Link>
      {completeButtonText && (
        <Button secondary={true} className="TransactionReceipt-another" onClick={resetFlow}>
          {completeButtonText}
        </Button>
      )}
    </div>
  );
}
