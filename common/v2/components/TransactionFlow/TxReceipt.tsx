import React, { useState, useContext, useEffect, FC, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import {
  ITxReceipt,
  ITxStatus,
  IStepComponentProps,
  TSymbol,
  ITxType,
  TAddress,
  ExtendedAddressBook
} from 'v2/types';
import { Amount, TimeElapsedCounter, AssetIcon, LinkOut } from 'v2/components';
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
import { SwapDisplayData } from 'v2/features/SwapAssets/types';
import translate, { translateRaw } from 'v2/translations';
import { convertToFiat, truncate, fromTxReceiptObj } from 'v2/utils';
import { isWeb3Wallet } from 'v2/utils/web3';
import ProtocolTagsList from 'v2/features/DeFiZap/components/ProtocolTagsList';
import { WithProtectApiFactory } from 'v2/features/ProtectTransaction';
import { AbortTransaction } from 'v2/features/ProtectTransaction/components';

import { FromToAccount, SwapFromToDiagram, TransactionDetailsDisplay } from './displays';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import sentIcon from 'common/assets/images/icn-sent.svg';
import defizaplogo from 'assets/images/defizap/defizaplogo.svg';
import './TxReceipt.scss';

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
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
  withProtectApi?: WithProtectApiFactory;
  protectTxButton?(): JSX.Element;
}

const SImg = styled('img')`
  height: ${(p: { size: string }) => p.size};
  width: ${(p: { size: string }) => p.size};
`;

export default function TxReceipt({
  txReceipt,
  txConfig,
  resetFlow,
  completeButtonText,
  pendingButton,
  txType = ITxType.STANDARD,
  zapSelected,
  swapDisplay,
  withProtectApi,
  protectTxButton
}: IStepComponentProps & Props) {
  const { getAssetRate } = useContext(RatesContext);
  const { getContactByAccount, getContactByAddressAndNetwork } = useContext(AddressBookContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const [txStatus, setTxStatus] = useState(ITxStatus.PENDING);
  const [displayTxReceipt, setDisplayTxReceipt] = useState<ITxReceipt | undefined>(txReceipt);
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  const protectionTxTimeoutFunction = useRef<(cb: (txReceipt: ITxReceipt) => void) => void>();
  const [web3Wallet, setWeb3Wallet] = useState(false);
  const [protectTxEnabled, setProtectTxEnabled] = useState(false);

  useEffect(() => {
    if (withProtectApi) {
      const {
        withProtectState: {
          protectTxEnabled: isProtectTxEnabled,
          isWeb3Wallet: isProtectedTxWeb3Wallet
        },
        invokeProtectionTxTimeoutFunction
      } = withProtectApi;

      setProtectTxEnabled(isProtectTxEnabled);
      setWeb3Wallet(isProtectedTxWeb3Wallet);
      protectionTxTimeoutFunction.current = invokeProtectionTxTimeoutFunction;
    }
  }, [withProtectApi, setWeb3Wallet, protectionTxTimeoutFunction]);

  useEffect(() => {
    setDisplayTxReceipt(txReceipt);
  }, [setDisplayTxReceipt, txReceipt]);

  const [protectTxCounter, setProtectTxCounter] = React.useState(20);
  useEffect(() => {
    let protectTxTimer: number | null = null;
    if (!web3Wallet && protectTxEnabled && protectTxCounter > 0) {
      // @ts-ignore
      protectTxTimer = setTimeout(() => setProtectTxCounter(prevCount => prevCount - 1), 1000);
    } else if (!web3Wallet && protectTxEnabled && protectTxCounter === 0) {
      if (protectionTxTimeoutFunction.current) {
        protectionTxTimeoutFunction.current(txReceiptCb => {
          setDisplayTxReceipt(txReceiptCb);
        });
      }
    }
    return () => {
      if (protectTxTimer) {
        clearTimeout(protectTxTimer);
      }
    };
  }, [protectTxEnabled, protectTxCounter, web3Wallet]);

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

  const assetRate = useCallback(() => {
    if (displayTxReceipt && 'asset' in displayTxReceipt) {
      return getAssetRate(displayTxReceipt.asset);
    } else {
      return getAssetRate(txConfig.asset);
    }
  }, [displayTxReceipt, txConfig.asset]);

  const { senderAccount } = txConfig;
  const senderContact = getContactByAccount(senderAccount);
  const recipientContact = getContactByAddressAndNetwork(
    txConfig.receiverAddress,
    txConfig.network
  );

  return (
    <TxReceiptUI
      txConfig={txConfig}
      txReceipt={txReceipt}
      txType={txType}
      assetRate={assetRate}
      zapSelected={zapSelected}
      swapDisplay={swapDisplay}
      txStatus={txStatus}
      timestamp={timestamp}
      senderContact={senderContact}
      recipientContact={recipientContact}
      displayTxReceipt={displayTxReceipt}
      resetFlow={resetFlow}
      completeButtonText={completeButtonText}
      pendingButton={pendingButton}
      protectTxEnabled={protectTxEnabled}
      web3Wallet={web3Wallet}
      protectTxCounter={protectTxCounter}
      setProtectTxCounter={setProtectTxCounter}
      protectTxButton={protectTxButton}
    />
  );
}

export interface TxReceiptDataProps {
  txStatus: ITxStatus;
  timestamp: number;
  displayTxReceipt?: ITxReceipt;
  senderContact: ExtendedAddressBook | undefined;
  recipientContact: ExtendedAddressBook | undefined;
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
  protectTxEnabled?: boolean;
  web3Wallet?: boolean;
  protectTxCounter?: number;
  assetRate(): number | undefined;
  protectTxButton?(): JSX.Element;
  setProtectTxCounter?(counter: number): void;
  resetFlow(): void;
}

export const TxReceiptUI = ({
  txType,
  swapDisplay,
  txConfig,
  txStatus,
  timestamp,
  assetRate,
  displayTxReceipt,
  zapSelected,
  senderContact,
  recipientContact,
  pendingButton,
  resetFlow,
  completeButtonText,
  protectTxEnabled = false,
  web3Wallet = false,
  protectTxCounter,
  setProtectTxCounter,
  protectTxButton
}: Omit<IStepComponentProps, 'resetFlow' | 'onComplete'> & TxReceiptDataProps) => {
  /* Determing User's Contact */
  const { asset, gasPrice, gasLimit, senderAccount, network, data, nonce, baseAsset } = txConfig;

  const recipientLabel = recipientContact ? recipientContact.label : translateRaw('NO_ADDRESS');
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

  const shouldRenderPendingBtn =
    pendingButton && txStatus === ITxStatus.PENDING && !isWeb3Wallet(senderAccount.wallet);

  return (
    <div className="TransactionReceipt">
      {protectTxEnabled && !web3Wallet && (
        <AbortTransaction
          countdown={protectTxCounter ? protectTxCounter : 0}
          onAbortTransactionClick={e => {
            e.preventDefault();
            if (setProtectTxCounter) {
              setProtectTxCounter(-1);
            }
          }}
          onSendTransactionClick={e => {
            e.preventDefault();
            if (setProtectTxCounter) {
              setProtectTxCounter(20);
            }
          }}
        />
      )}
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
      <>
        <FromToAccount
          from={{
            address: ((displayTxReceipt && displayTxReceipt.from) ||
              txConfig.senderAccount.address) as TAddress,
            label: senderAccountLabel
          }}
          to={{
            address: ((displayTxReceipt && displayTxReceipt.to) ||
              txConfig.receiverAddress) as TAddress,
            label: recipientLabel
          }}
        />
      </>

      {txType === ITxType.DEFIZAP && zapSelected && (
        <>
          <div className="TransactionReceipt-row">
            <TxIntermediaryDisplay
              address={zapSelected.contractAddress}
              contractName={'DeFi Zap'}
            />
          </div>
          <div className="TransactionReceipt-row">
            <div className="TransactionReceipt-row-column">
              <SImg src={defizaplogo} size="24px" />
              {translateRaw('ZAP_NAME')}
            </div>
            <div className="TransactionReceipt-row-column rightAligned">{zapSelected.name}</div>
          </div>
          <div className="TransactionReceipt-row">
            <div className="TransactionReceipt-row-column">{translateRaw('PLATFORMS')}</div>
            <div className="TransactionReceipt-row-column rightAligned">
              <ProtocolTagsList platformsUsed={zapSelected.platformsUsed} />
            </div>
          </div>
          <div className="TransactionReceipt-divider" />
        </>
      )}

      {txType !== ITxType.SWAP && (
        <div className="TransactionReceipt-row">
          <div className="TransactionReceipt-row-column">
            <img src={sentIcon} alt="Sent" />
            {translate('CONFIRM_TX_SENT')}
          </div>
          <div className="TransactionReceipt-row-column rightAligned">
            <AssetIcon symbol={asset.ticker as TSymbol} size={'24px'} />
            <Amount
              assetValue={`${parseFloat(assetAmount()).toFixed(6)} ${assetTicker()}`}
              fiatValue={`$${convertToFiat(parseFloat(assetAmount()), assetRate()).toFixed(2)}
            `}
            />
          </div>
        </div>
      )}
      {txType !== ITxType.DEFIZAP && <div className="TransactionReceipt-divider" />}
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

        {protectTxButton && protectTxButton()}

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
