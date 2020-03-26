import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';
import * as R from 'ramda';

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
import { convertToFiat, truncate, fromTxReceiptObj } from 'v2/utils';
import { isWeb3Wallet } from 'v2/utils/web3';
import ProtocolTagsList from 'v2/features/DeFiZap/components/ProtocolTagsList';
import { MembershipReceiptBanner } from 'v2/features/PurchaseMembership';
import { DeFiZapLogo } from 'v2/features/DeFiZap';

import { ISender } from './types';
import { constructSenderFromTxConfig } from './helpers';
import { FromToAccount, SwapFromToDiagram, TransactionDetailsDisplay } from './displays';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import sentIcon from 'common/assets/images/icn-send.svg';
import defizaplogo from 'assets/images/defizap/defizaplogo.svg';
import './TxReceipt.scss';

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}
interface Props {
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
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
  swapDisplay
}: IStepComponentProps & Props) {
  const { getAssetRate } = useContext(RatesContext);
  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);
  const { addNewTransactionToAccount } = useContext(AccountContext);
  const { accounts } = useContext(StoreContext);
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
          if (sender.account) {
            addNewTransactionToAccount(sender.account, {
              ...displayTxReceipt,
              txType: displayTxReceipt ? displayTxReceipt.txType : ITxType.STANDARD,
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

  const assetForRateFetch = 'asset' in displayTxReceipt ? displayTxReceipt.asset : undefined;
  const assetRate = getAssetRate(assetForRateFetch);
  const sender = constructSenderFromTxConfig(txConfig, accounts);
  const { receiverAddress, network } = txConfig;
  const senderContact = getContactByAddressAndNetworkId(sender.address, network.id);
  const recipientContact = getContactByAddressAndNetworkId(receiverAddress, network.id);

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
      resetFlow={resetFlow}
      completeButtonText={completeButtonText}
      pendingButton={pendingButton}
    />
  );
}

export interface TxReceiptDataProps {
  txStatus: ITxStatus;
  timestamp: number;
  assetRate: number | undefined;
  displayTxReceipt: ITxReceipt;
  senderContact: ExtendedAddressBook | undefined;
  sender: ISender;
  recipientContact: ExtendedAddressBook | undefined;
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
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
  membershipSelected,
  senderContact,
  sender,
  recipientContact,
  pendingButton,
  resetFlow,
  completeButtonText
}: Omit<IStepComponentProps, 'resetFlow' | 'onComplete'> & TxReceiptDataProps) => {
  /* Determing User's Contact */
  const { asset, gasPrice, gasLimit, data, nonce, baseAsset, receiverAddress } = txConfig;
  const recipientLabel = recipientContact ? recipientContact.label : translateRaw('NO_ADDRESS');
  const senderAccountLabel = senderContact ? senderContact.label : translateRaw('NO_LABEL');

  const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();
  const assetAmount = displayTxReceipt.amount || txConfig.amount;
  const assetTicker = 'asset' in displayTxReceipt ? displayTxReceipt.asset.ticker : 'ETH';

  let txUrl = '';
  if (R.path(['network', 'blockExplorer', 'txUrl'], displayTxReceipt)) {
    txUrl = displayTxReceipt.network.blockExplorer.txUrl(displayTxReceipt.hash);
  } else if (R.path(['network', 'blockExplorer', 'txUrl'], sender)) {
    txUrl = sender.network.blockExplorer!.txUrl(displayTxReceipt.hash);
  }
  const shouldRenderPendingBtn =
    pendingButton &&
    txStatus === ITxStatus.PENDING &&
    sender.account &&
    !isWeb3Wallet(sender.account.wallet);

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
            fromAmount={swapDisplay.fromAmount.toString()}
            toAmount={swapDisplay.toAmount.toString()}
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
              address: (displayTxReceipt.from || sender.address) as TAddress,
              label: senderAccountLabel
            }}
            to={{
              address: (displayTxReceipt.to || receiverAddress) as TAddress,
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
            <AssetIcon symbol={asset.ticker as TSymbol} size={'24px'} />
            <Amount
              assetValue={`${parseFloat(assetAmount).toFixed(6)} ${assetTicker}`}
              fiatValue={`$${convertToFiat(parseFloat(assetAmount), assetRate).toFixed(2)}
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
