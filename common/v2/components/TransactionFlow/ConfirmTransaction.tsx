import React, { useContext, useState } from 'react';
import BN from 'bn.js';
import { Address, Button } from '@mycrypto/ui';

import feeIcon from 'common/assets/images/icn-fee.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import { AddressBookContext } from 'v2/services/Store';
import { Amount } from 'v2/components';
import { fromWei, Wei, totalTxFeeToString, totalTxFeeToWei } from 'v2/services/EthService';
import { RatesContext } from 'v2/services/RatesProvider';
import { TTicker, IStepComponentProps } from 'v2/types';

import './ConfirmTransaction.scss';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import TransactionIntermediaryDisplay from './displays/TransactionIntermediaryDisplay';
import { convertToFiat, truncate } from 'v2/utils';
import translate from 'v2/translations';

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
          {translate('CONFIRM_TX_FROM')}
          <div className="ConfirmTransaction-addressWrapper">
            <Address
              address={senderAccount ? senderAccount.address : 'Unknown'}
              title={senderAccountLabel}
              truncate={truncate}
            />
          </div>
        </div>
        <div className="ConfirmTransaction-row-column">
          {translate('CONFIRM_TX_TO')}
          <div className="ConfirmTransaction-addressWrapper">
            <Address
              address={receiverAddress || 'Unknown'}
              title={recipientLabel}
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
          <img src={sendIcon} alt="Send" /> {translate('FORM_SEND_AMOUNT')}:
        </div>
        <div className="ConfirmTransaction-row-column">
          <Amount
            assetValue={`${parseFloat(amount).toFixed(6)} ${asset.ticker}`}
            fiatValue={`$${convertToFiat(
              parseFloat(amount),
              getRate(asset.ticker as TTicker)
            ).toFixed(2)}
          `}
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
            fiatValue={`$${convertToFiat(
              parseFloat(maxTransactionFeeBase),
              getRate(baseAsset.ticker as TTicker)
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
              fiatValue={`$${convertToFiat(
                parseFloat(totalEtherEgress),
                getRate(asset.ticker as TTicker)
              ).toFixed(2)}`}
            />
          ) : (
            <Amount
              assetValue={`${amount} ${asset.ticker}`}
              baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
              fiatValue={`$${(
                convertToFiat(parseFloat(amount), getRate(asset.ticker as TTicker)) +
                convertToFiat(parseFloat(totalEtherEgress), getRate(baseAsset.ticker as TTicker))
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
        {isBroadcastingTx ? translate('SUBMITTING') : translate('CONFIRM_AND_SEND')}
      </Button>
    </div>
  );
}
