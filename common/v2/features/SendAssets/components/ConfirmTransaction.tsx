import React, { useContext, useState } from 'react';
import BN from 'bn.js';
import { Address, Button } from '@mycrypto/ui';

import feeIcon from 'common/assets/images/icn-fee.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import { AddressBookContext } from 'v2/services/Store';
import { Amount } from 'v2/components';
import { fromWei, Wei, totalTxFeeToString, totalTxFeeToWei } from 'v2/services/EthService';
import { RatesContext } from 'v2/services/RatesProvider';
import { TTicker } from 'v2/types';

import { IStepComponentProps } from '../types';
import './ConfirmTransaction.scss';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import TransactionIntermediaryDisplay from './displays/TransactionIntermediaryDisplay';

const truncate = (children: string) => {
  return [children.substring(0, 6), '…', children.substring(children.length - 4)].join('');
};

/*
  Confirm should only display values! There are no data transformations.
  The currentPath in SendAssets determines which action should be called.
*/

const calculateValue = (rate: number | undefined, balance: string) => {
  if (!rate) return 0;
  return rate * parseFloat(balance);
};

export default function ConfirmTransaction({
  txConfig,
  onComplete,
  signedTx
}: IStepComponentProps) {
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const [isBroadcastingTx, setIsBroadcastingTx] = useState(false);
  const handleApprove = () => {
    setIsBroadcastingTx(true);
    onComplete(null);
  };

  const { getRate } = useContext(RatesContext);
  const recipientContact = getContactByAddressAndNetwork(
    txConfig.receiverAddress,
    txConfig.network
  );
  const recipientLabel = recipientContact ? recipientContact.label : 'Unknown Address';

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
    data,
    baseAsset
  } = txConfig;
  const assetType = asset.type;

  /* Calculate Transaction Fee */
  const transactionFeeWei: BN = totalTxFeeToWei(gasPrice, gasLimit);
  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);

  /* Calculate total base asset amount */
  const valueWei = Wei(value);
  const totalEtherEgress = parseFloat(fromWei(valueWei.add(transactionFeeWei), 'ether')).toFixed(6); // @TODO: BN math, add amount + maxCost !In same symbol

  /* Determing User's Contact */
  const senderContact = getContactByAccount(senderAccount);
  const senderAccountLabel = senderContact ? senderContact.label : 'Unknown Account';

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
              title={senderAccountLabel}
              truncate={truncate}
            />
          </div>
        </div>
      </div>
      {assetType === 'erc20' && (
        <div className="ConfirmTransaction-row">
          <TransactionIntermediaryDisplay asset={asset} />
        </div>
      )}
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <img src={sendIcon} alt="Send" /> Send Amount:
        </div>
        <div className="ConfirmTransaction-row-column">
          <Amount
            assetValue={`${amount} ${asset.ticker}`}
            fiatValue={`$${calculateValue(getRate(asset.ticker as TTicker), amount).toFixed(2)}`}
          />
        </div>
      </div>
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <img src={feeIcon} alt="Fee" /> Max. Transaction Fee:
        </div>
        <div className="ConfirmTransaction-row-column">
          <Amount
            assetValue={`${maxTransactionFeeBase} ${baseAsset.ticker}`}
            fiatValue={`$${calculateValue(
              getRate(baseAsset.ticker as TTicker),
              maxTransactionFeeBase
            ).toFixed(2)}`}
          />
        </div>
      </div>
      <div className="ConfirmTransaction-divider" />
      <div className="ConfirmTransaction-row">
        <div className="ConfirmTransaction-row-column">
          <img src={sendIcon} alt="Total" /> Total:
        </div>
        <div className="ConfirmTransaction-row-column">
          {assetType === 'base' ? (
            <Amount
              assetValue={`${totalEtherEgress} ${asset.ticker}`}
              fiatValue={`$${calculateValue(
                getRate(asset.ticker as TTicker),
                totalEtherEgress
              ).toFixed(2)}`}
            />
          ) : (
            <Amount
              assetValue={`${amount} ${asset.ticker}`}
              baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
              fiatValue={`$${(
                calculateValue(getRate(asset.ticker as TTicker), amount) +
                calculateValue(getRate(baseAsset.ticker as TTicker), totalEtherEgress)
              ).toFixed(2)}`}
            />
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
        signedTransaction={signedTx}
      />
      <Button
        onClick={handleApprove}
        disabled={isBroadcastingTx}
        className="ConfirmTransaction-button"
      >
        {isBroadcastingTx ? 'Submitting...' : 'Confirm and Send'}
      </Button>
    </div>
  );
}
