import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';

import { ITxReceipt, ITxStatus, IStepComponentProps, TSymbol, ITxType } from 'v2/types';
import { Amount, TimeElapsedCounter, AssetIcon, LinkOut, Account } from 'v2/components';
import {
  AddressBookContext,
  AccountContext,
  AssetContext,
  NetworkContext
} from 'v2/services/Store';
import { RatesContext } from 'v2/services/RatesProvider';
import {
  ProviderHandler,
  getTimestampFromBlockNum,
  getTransactionReceiptFromHash
} from 'v2/services/EthService';
import { ROUTE_PATHS } from 'v2/config';
import translate, { translateRaw } from 'v2/translations';
import { convertToFiat, truncate, fromTxReceiptObj } from 'v2/utils';
import { isWeb3Wallet } from 'v2/utils/web3';

import './TransactionReceipt.scss';
// Legacy
import sentIcon from 'common/assets/images/icn-sent.svg';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import { SwapDisplayData } from 'v2/features/SwapAssets/types';
import { SwapFromToDiagram } from 'v2/features/SwapAssets/components/fields';

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}
interface Props {
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
}

export default function TransactionReceipt({
  txReceipt,
  txConfig,
  resetFlow,
  completeButtonText,
  pendingButton,
  txType = ITxType.STANDARD,
  swapDisplay
}: IStepComponentProps & Props) {
  const { getAssetRate } = useContext(RatesContext);
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const [txStatus, setTxStatus] = useState(ITxStatus.PENDING);
  const [displayTxReceipt, setDisplayTxReceipt] = useState(txReceipt as ITxReceipt);
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  useEffect(() => {
    const provider = new ProviderHandler(displayTxReceipt.network || txConfig.network);
    if (blockNumber === 0 && displayTxReceipt.hash) {
      const blockNumInterval = setInterval(() => {
        getTransactionReceiptFromHash(displayTxReceipt.hash, provider).then(transactionOutcome => {
          if (!transactionOutcome) {
            return;
          }
          const transactionStatus =
            transactionOutcome.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
          setTxStatus(prevStatusState => transactionStatus || prevStatusState);
          setBlockNumber((prevState: number) => transactionOutcome.blockNumber || prevState);
          provider.getTransactionByHash(displayTxReceipt.hash).then(transactionReceipt => {
            const receipt = fromTxReceiptObj(transactionReceipt)(assets, networks) as ITxReceipt;
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
          addNewTransactionToAccount(senderAccount, {
            ...displayTxReceipt,
            timestamp: transactionTimestamp || 0,
            stage: txStatus
          });
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
  const recipientLabel = recipientContact ? recipientContact.label : translateRaw('NO_ADDRESS');

  /* ToDo: Figure out how to extract this */
  const { asset, gasPrice, gasLimit, senderAccount, network, data, nonce, baseAsset } = txConfig;

  /* Determing User's Contact */
  const senderContact = getContactByAccount(senderAccount);
  const senderAccountLabel = senderContact ? senderContact.label : translateRaw('NO_LABEL');

  const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();
  const assetAmount = displayTxReceipt.amount || txConfig.amount;
  const assetTicker = 'asset' in displayTxReceipt ? displayTxReceipt.asset.ticker : 'ETH';
  const assetForRateFetch = 'asset' in displayTxReceipt ? displayTxReceipt.asset : undefined;

  const txUrl = displayTxReceipt.network.blockExplorer.txUrl(displayTxReceipt.hash);
  const shouldRenderPendingBtn =
    pendingButton && txStatus === ITxStatus.PENDING && !isWeb3Wallet(senderAccount.wallet);

  return (
    <div className="TransactionReceipt">
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-desc">
          {translate('TRANSACTION_BROADCASTED_DESC')}
        </div>
      </div>
      {txType === ITxType.SWAP && swapDisplay && (
        <div className="TransactionReceipt-row">
          <SwapFromToDiagram
            fromSymbol={swapDisplay.fromAsset.symbol}
            toSymbol={swapDisplay.toAsset.symbol}
            fromAmount={swapDisplay.fromAmount}
            toAmount={swapDisplay.toAmount}
          />
        </div>
      )}
      <div className="TransactionReceipt-row TransactionReceipt-row-from-to">
        <div className="TransactionReceipt-row-column">
          {translate('CONFIRM_TX_FROM')}
          <div className="TransactionReceipt-addressWrapper">
            <Account
              address={displayTxReceipt.from || txConfig.senderAccount.address}
              title={senderAccountLabel}
              truncate={truncate}
            />
          </div>
        </div>
        {txType !== ITxType.SWAP && (
          <div className="TransactionReceipt-row-column">
            {translate('CONFIRM_TX_TO')}
            <div className="TransactionReceipt-addressWrapper">
              <Account
                address={displayTxReceipt.to || txConfig.receiverAddress}
                title={recipientLabel}
                truncate={truncate}
              />
            </div>
          </div>
        )}
      </div>
      {txType !== ITxType.SWAP && (
        <div className="TransactionReceipt-row">
          <div className="TransactionReceipt-row-column">
            <img src={sentIcon} alt="Sent" />
            {translate('CONFIRM_TX_SENT')}
          </div>
          <div className="TransactionReceipt-row-column-amount">
            <AssetIcon symbol={asset.ticker as TSymbol} size={'24px'} />
            <Amount
              assetValue={`${parseFloat(assetAmount).toFixed(6)} ${assetTicker}`}
              fiatValue={`$${convertToFiat(
                parseFloat(assetAmount),
                getAssetRate(assetForRateFetch)
              ).toFixed(2)}
            `}
            />
          </div>
        </div>
      )}
      <div className="TransactionReceipt-divider" />
      <div className="TransactionReceipt-details">
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">
            {translate('TRANSACTION_ID')}:
          </div>
          <div className="TransactionReceipt-details-row-column">
            <LinkOut text={displayTxReceipt.hash} truncate={truncate} link={txUrl} />
          </div>
        </div>

        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">
            {translate('TRANSACTION_STATUS')}:
          </div>
          <div className="TransactionReceipt-details-row-column">{translate(txStatus)}</div>
        </div>

        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">{translate('TIMESTAMP')}:</div>
          <div className="TransactionReceipt-details-row-column">
            {timestamp !== 0 ? (
              <div>
                <TimeElapsedCounter timestamp={timestamp} isSeconds={true} />
                <br /> {localTimestamp}
              </div>
            ) : (
              translate('UNKNOWN')
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
      {shouldRenderPendingBtn && (
        <Button
          secondary={true}
          className="TransactionReceipt-another"
          onClick={() => pendingButton!.action(resetFlow)}
        >
          {pendingButton!.text}
        </Button>
      )}
      {completeButtonText && !shouldRenderPendingBtn && (
        <Button secondary={true} className="TransactionReceipt-another" onClick={resetFlow}>
          {completeButtonText}
        </Button>
      )}
      <Link to={ROUTE_PATHS.DASHBOARD.path}>
        <Button className="TransactionReceipt-back">
          {translate('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD')}
        </Button>
      </Link>
    </div>
  );
}
