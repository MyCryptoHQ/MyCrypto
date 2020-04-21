import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import R_path from 'ramda/src/path';

import {
  ITxReceipt,
  ITxStatus,
  IStepComponentProps,
  ITxType,
  TAddress,
  ExtendedAddressBook
} from 'v2/types';
import { Amount, TimeElapsedCounter, AssetIcon, LinkOut } from 'v2/components';
import {
  AddressBookContext,
  AccountContext,
  AssetContext,
  NetworkContext,
  StoreContext
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
import { convertToFiat, fromTransactionResponseToITxReceipt, truncate } from 'v2/utils';
import { isWeb3Wallet } from 'v2/utils/web3';
import ProtocolTagsList from 'v2/features/DeFiZap/components/ProtocolTagsList';
import { ProtectTxUtils, ProtectTxContext } from 'v2/features/ProtectTransaction';
import { ProtectTxAbort } from 'v2/features/ProtectTransaction/components';
import { MembershipReceiptBanner } from 'v2/features/PurchaseMembership';
import { DeFiZapLogo } from 'v2/features/DeFiZap';

import { ISender } from './types';
import { constructSenderFromTxConfig } from './helpers';
import { FromToAccount, SwapFromToDiagram, TransactionDetailsDisplay } from './displays';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import { PendingTransaction } from './PendingLoader';

import sentIcon from 'common/assets/images/icn-sent.svg';
import defizaplogo from 'assets/images/defizap/defizaplogo.svg';
import './TxReceipt.scss';

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}
interface Props {
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
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
  membershipSelected,
  zapSelected,
  swapDisplay,
  protectTxButton
}: IStepComponentProps & Props) {
  const { getAssetRate } = useContext(RatesContext);
  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const { accounts } = useContext(StoreContext);
  const { assets } = useContext(AssetContext);
  const { networks } = useContext(NetworkContext);
  const [txStatus, setTxStatus] = useState(ITxStatus.PENDING);
  const [displayTxReceipt, setDisplayTxReceipt] = useState<ITxReceipt | undefined>(txReceipt);
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  const protectTxContext = useContext(ProtectTxContext);
  const getProTxValue = ProtectTxUtils.isProtectTxDefined(protectTxContext);

  useEffect(() => {
    setDisplayTxReceipt(txReceipt);
  }, [setDisplayTxReceipt, txReceipt]);

  useEffect(() => {
    if (displayTxReceipt && blockNumber === 0 && displayTxReceipt.hash) {
      const provider = new ProviderHandler(displayTxReceipt.network || txConfig.network);
      const blockNumInterval = setInterval(() => {
        getTransactionReceiptFromHash(displayTxReceipt.hash, provider).then(transactionOutcome => {
          if (transactionOutcome) {
            const transactionStatus =
              transactionOutcome.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
            setTxStatus(prevStatusState => transactionStatus || prevStatusState);
            setBlockNumber((prevState: number) => transactionOutcome.blockNumber || prevState);
            provider.getTransactionByHash(displayTxReceipt.hash).then(transactionResponse => {
              const receipt = fromTransactionResponseToITxReceipt(transactionResponse)(
                assets,
                networks
              );
              setDisplayTxReceipt(receipt);
            });
          }
        });
      }, 1000);
      return () => clearInterval(blockNumInterval);
    }
  });
  useEffect(() => {
    if (displayTxReceipt && timestamp === 0 && blockNumber !== 0) {
      const provider = new ProviderHandler(displayTxReceipt.network || txConfig.network);
      const timestampInterval = setInterval(() => {
        getTimestampFromBlockNum(blockNumber, provider).then((transactionTimestamp) => {
          if (sender.account) {
            addNewTransactionToAccount(sender.account, {
              ...displayTxReceipt,
              type: displayTxReceipt ? displayTxReceipt.type : ITxType.STANDARD,
              timestamp: transactionTimestamp || 0,
              stage: txStatus
            });
          }
          setTimestamp(transactionTimestamp || 0);
        });
      }, 1000);

      return () => clearInterval(timestampInterval);
    }
  });

  const assetRate = useCallback(() => {
    if (displayTxReceipt && R_path(['asset'], displayTxReceipt)) {
      return getAssetRate(displayTxReceipt.asset!);
    } else {
      return getAssetRate(txConfig.asset);
    }
  }, [displayTxReceipt, txConfig.asset]);

  const senderContact = getContactByAddressAndNetworkId(
    txConfig.senderAccount.address,
    txConfig.network.id
  );
  const recipientContact = getContactByAddressAndNetworkId(
    txConfig.receiverAddress,
    txConfig.network.id
  );

  const sender = constructSenderFromTxConfig(txConfig, accounts);

  return (
    <TxReceiptUI
      txConfig={txConfig}
      txReceipt={txReceipt}
      txType={txType}
      assetRate={assetRate}
      zapSelected={zapSelected}
      membershipSelected={membershipSelected}
      swapDisplay={swapDisplay}
      txStatus={txStatus}
      timestamp={timestamp}
      senderContact={senderContact}
      sender={sender}
      recipientContact={recipientContact}
      displayTxReceipt={displayTxReceipt}
      setDisplayTxReceipt={setDisplayTxReceipt}
      resetFlow={resetFlow}
      completeButtonText={completeButtonText}
      pendingButton={pendingButton}
      protectTxEnabled={getProTxValue(['state', 'protectTxEnabled'])}
      web3Wallet={getProTxValue(['state', 'isWeb3Wallet'])}
      protectTxButton={protectTxButton}
    />
  );
}

export interface TxReceiptDataProps {
  txStatus: ITxStatus;
  timestamp: number;
  displayTxReceipt?: ITxReceipt;
  setDisplayTxReceipt?: Dispatch<SetStateAction<ITxReceipt | undefined>>;
  senderContact: ExtendedAddressBook | undefined;
  sender: ISender;
  recipientContact: ExtendedAddressBook | undefined;
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
  protectTxEnabled?: boolean;
  web3Wallet?: boolean;
  assetRate(): number | undefined;
  protectTxButton?(): JSX.Element;
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
  setDisplayTxReceipt,
  zapSelected,
  membershipSelected,
  senderContact,
  sender,
  recipientContact,
  pendingButton,
  resetFlow,
  completeButtonText,
  protectTxEnabled = false,
  web3Wallet = false,
  protectTxButton
}: Omit<IStepComponentProps, 'resetFlow' | 'onComplete'> & TxReceiptDataProps) => {
  /* Determining User's Contact */
  const { asset, gasPrice, gasLimit, data, nonce, baseAsset, receiverAddress } = txConfig;
  const recipientLabel = recipientContact ? recipientContact.label : translateRaw('NO_ADDRESS');
  const senderAccountLabel = senderContact ? senderContact.label : translateRaw('NO_LABEL');

  const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();
  const assetAmount = useCallback(() => {
    if (displayTxReceipt && R_path(['amount'], displayTxReceipt)) {
      return displayTxReceipt.amount;
    } else {
      return txConfig.amount;
    }
  }, [displayTxReceipt, txConfig.amount]);

  const assetTicker = useCallback(() => {
    if (displayTxReceipt && R_path(['asset'], displayTxReceipt)) {
      return displayTxReceipt.asset!.ticker;
    } else {
      return txConfig.asset.ticker;
    }
  }, [displayTxReceipt, txConfig.asset]);

  const shouldRenderPendingBtn =
    pendingButton &&
    txStatus === ITxStatus.PENDING &&
    sender.account &&
    !isWeb3Wallet(sender.account.wallet);

  return (
    <div className="TransactionReceipt">
      {protectTxEnabled && !web3Wallet && (
        <ProtectTxAbort
          onTxSent={(txReceipt) => {
            if (setDisplayTxReceipt) {
              setDisplayTxReceipt(txReceipt);
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
            fromAmount={swapDisplay.fromAmount.toString()}
            toAmount={swapDisplay.toAmount.toString()}
            fromUUID={swapDisplay.fromAsset.uuid}
            toUUID={swapDisplay.toAsset.uuid}
          />
        </div>
      )}
      {txType === ITxType.PURCHASE_MEMBERSHIP && membershipSelected && (
        <div className="TransactionReceipt-row">
          <MembershipReceiptBanner membershipSelected={membershipSelected} />
        </div>
      )}
      {txType !== ITxType.PURCHASE_MEMBERSHIP && (
        <>
          <FromToAccount
            from={{
              address: (displayTxReceipt && displayTxReceipt.from) || sender.address,
              label: senderAccountLabel
            }}
            to={{
              address: (displayTxReceipt && displayTxReceipt.to) || (receiverAddress as TAddress),
              label: recipientLabel
            }}
          />
        </>
      )}
      {txType === ITxType.PURCHASE_MEMBERSHIP && membershipSelected && (
        <div className="TransactionReceipt-row">
          <TxIntermediaryDisplay
            address={membershipSelected.contractAddress}
            contractName={asset.ticker}
          />
        </div>
      )}
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
            <div className="TransactionReceipt-row-column rightAligned">{zapSelected.title}</div>
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
            <AssetIcon uuid={asset.uuid} size={'24px'} />
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
            {displayTxReceipt &&
              displayTxReceipt.network &&
              displayTxReceipt.network.blockExplorer && (
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
          sender={sender}
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
      {txType === ITxType.DEFIZAP && <DeFiZapLogo />}
    </div>
  );
};
