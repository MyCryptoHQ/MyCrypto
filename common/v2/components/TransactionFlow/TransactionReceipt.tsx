import React, { useState, useContext, useEffect, useCallback, FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';

import { ITxReceipt, ITxStatus, IStepComponentProps, TSymbol } from 'v2/types';
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
import { SignTransaction } from '../../features/SendAssets/components';
import { withProtectTransaction } from '../../features/ProtectTransaction/components/WithProtectTransaction';
import { WithProtectApiFactory } from '../../features/ProtectTransaction/withProtectStateFactory';
import { AbortTransaction } from '../../features/ProtectTransaction/components/AbortTransaction';

const PendingTransaction: FC = () => {
  return (
    <div className="pending-loader">
      <div className="loading" />
      <span>
        <b>Pending</b>
      </span>
    </div>
  );
};

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}
interface Props {
  customDetails?: JSX.Element;
  pendingButton?: PendingBtnAction;
  withProtectApi: WithProtectApiFactory;
}

const TransactionReceipt = ({
  txReceipt,
  txConfig,
  resetFlow,
  completeButtonText,
  customDetails,
  pendingButton,
  withProtectApi
}: IStepComponentProps & Props) => {
  const { getAssetRate } = useContext(RatesContext);
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const [txStatus, setTxStatus] = useState(ITxStatus.PENDING);
  const [displayTxReceipt, setDisplayTxReceipt] = useState<ITxReceipt | undefined>(txReceipt);
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  const {
    withProtectState: { protectTxEnabled },
    invokeProtectionTxTimeoutFunction
  } = withProtectApi;
  const [protectTxCounter, setProtectTxCounter] = React.useState(20);

  useEffect(() => {
    let protectTxTimer: number | null = null;
    if (protectTxEnabled && protectTxCounter > 0) {
      // @ts-ignore
      protectTxTimer = setTimeout(() => setProtectTxCounter(prevCount => prevCount - 1), 1000);
    } else if (protectTxEnabled && protectTxCounter === 0) {
      invokeProtectionTxTimeoutFunction(txReceiptCb => {
        setDisplayTxReceipt(txReceiptCb);
      });
    }
    return () => {
      if (protectTxTimer) {
        clearTimeout(protectTxTimer);
      }
    };
  }, [protectTxEnabled, protectTxCounter]);

  useEffect(() => {
    if (displayTxReceipt) {
      const provider = new ProviderHandler(displayTxReceipt.network || txConfig.network);
      if (blockNumber === 0 && displayTxReceipt.hash) {
        const blockNumInterval = setInterval(() => {
          getTransactionReceiptFromHash(displayTxReceipt.hash, provider).then(
            transactionOutcome => {
              if (!transactionOutcome) {
                return;
              }
              const transactionStatus =
                transactionOutcome.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
              setTxStatus(prevStatusState => transactionStatus || prevStatusState);
              setBlockNumber((prevState: number) => transactionOutcome.blockNumber || prevState);
              provider.getTransactionByHash(displayTxReceipt.hash).then(transactionReceipt => {
                const receipt = fromTxReceiptObj(transactionReceipt)(
                  assets,
                  networks
                ) as ITxReceipt;
                setDisplayTxReceipt(receipt);
              });
            }
          );
        }, 1000);
        return () => clearInterval(blockNumInterval);
      }
    }
  });
  useEffect(() => {
    if (displayTxReceipt) {
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

  const assetAmount = useCallback(() => {
    if (displayTxReceipt && 'amount' in displayTxReceipt) {
      return displayTxReceipt.amount;
    } else {
      return txConfig.amount;
    }
  }, [displayTxReceipt, txConfig.amount]);

  const assetTicker = useCallback(() => {
    if (displayTxReceipt && 'asset' in displayTxReceipt) {
      return displayTxReceipt.asset.ticker;
    } else {
      return txConfig.asset.ticker;
    }
  }, [displayTxReceipt, txConfig.asset]);

  const assetForRateFetch = useCallback(() => {
    if (displayTxReceipt && 'asset' in displayTxReceipt) {
      return displayTxReceipt.asset;
    } else {
      return txConfig.asset;
    }
  }, [displayTxReceipt, txConfig.asset]);

  const fromAddress = useCallback((): string => {
    if (displayTxReceipt && 'from' in displayTxReceipt) {
      return displayTxReceipt.from;
    } else {
      return txConfig.senderAccount.address;
    }
  }, [displayTxReceipt, txConfig.senderAccount]);

  const toAddress = useCallback((): string => {
    if (displayTxReceipt && 'to' in displayTxReceipt) {
      return displayTxReceipt.to;
    } else {
      return txConfig.receiverAddress;
    }
  }, [displayTxReceipt, txConfig.receiverAddress]);

  const shouldRenderPendingBtn =
    pendingButton && txStatus === ITxStatus.PENDING && !isWeb3Wallet(senderAccount.wallet);

  return (
    <div className="TransactionReceipt">
      {protectTxEnabled && (
        <AbortTransaction
          countdown={protectTxCounter}
          onAbortTransactionClick={e => {
            e.preventDefault();
            setProtectTxCounter(-1);
          }}
          onSendTransactionClick={e => {
            e.preventDefault();
            setProtectTxCounter(20);
          }}
        />
      )}
      <div className="TransactionReceipt-row">
        <div className="TransactionReceipt-row-desc">
          {translate('TRANSACTION_BROADCASTED_DESC')}
        </div>
      </div>
      {customDetails && <div className="TransactionReceipt-row">{customDetails}</div>}
      <div className="TransactionReceipt-row TransactionReceipt-row-from-to">
        <div className="TransactionReceipt-row-column">
          {translate('CONFIRM_TX_FROM')}
          <div className="TransactionReceipt-addressWrapper">
            <Account address={fromAddress()} title={senderAccountLabel} truncate={truncate} />
          </div>
        </div>
        <div className="TransactionReceipt-row-column">
          {translate('CONFIRM_TX_TO')}
          <div className="TransactionReceipt-addressWrapper">
            <Account address={toAddress()} title={recipientLabel} truncate={truncate} />
          </div>
        </div>
      </div>
      {!customDetails && (
        <div className="TransactionReceipt-row">
          <div className="TransactionReceipt-row-column">
            <img src={sentIcon} alt="Sent" />
            {translate('CONFIRM_TX_SENT')}
          </div>
          <div className="TransactionReceipt-row-column-amount">
            <AssetIcon symbol={asset.ticker as TSymbol} size={'24px'} />
            <Amount
              assetValue={`${parseFloat(assetAmount()).toFixed(6)} ${assetTicker()}`}
              fiatValue={`$${convertToFiat(
                parseFloat(assetAmount()),
                getAssetRate(assetForRateFetch())
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
            {displayTxReceipt && (
              <LinkOut
                text={displayTxReceipt.hash}
                truncate={truncate}
                link={displayTxReceipt.network.blockExplorer.txUrl(displayTxReceipt.hash)}
              />
            )}
            {!displayTxReceipt && <PendingTransaction />}
          </div>
        </div>

        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">
            {translate('TRANSACTION_STATUS')}:
          </div>
          <div className="TransactionReceipt-details-row-column">
            {displayTxReceipt && translate(txStatus)}
            {!displayTxReceipt && <PendingTransaction />}
          </div>
        </div>

        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">{translate('TIMESTAMP')}:</div>
          <div className="TransactionReceipt-details-row-column">
            {displayTxReceipt &&
              (timestamp !== 0 ? (
                <div>
                  <TimeElapsedCounter timestamp={timestamp} isSeconds={true} />
                  <br /> {localTimestamp}
                </div>
              ) : (
                translate('UNKNOWN')
              ))}
            {!displayTxReceipt && <PendingTransaction />}
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
};

export default withProtectTransaction(TransactionReceipt, SignTransaction);
