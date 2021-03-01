import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled from 'styled-components';

import {
  Body,
  Box,
  Button,
  Icon,
  LinkApp,
  PoweredByText,
  Text,
  TimeElapsed,
  Tooltip
} from '@components';
import { SubHeading } from '@components/NewTypography';
import { getWalletConfig, ROUTE_PATHS } from '@config';
import { getFiat } from '@config/fiats';
import { ProtectTxAbort } from '@features/ProtectTransaction/components/ProtectTxAbort';
import { ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { makeFinishedTxReceipt } from '@helpers';
import {
  fetchGasPriceEstimates,
  getAssetByContractAndNetwork,
  useAssets,
  useRates
} from '@services';
import {
  getTimestampFromBlockNum,
  getTransactionReceiptFromHash,
  ProviderHandler
} from '@services/EthService';
import {
  getStoreAccount,
  StoreContext,
  useAccounts,
  useContacts,
  useSettings
} from '@services/Store';
import { BREAK_POINTS, COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  ExtendedContact,
  Fiat,
  IPendingTxReceipt,
  ISettings,
  IStepComponentProps,
  ITxHistoryStatus,
  ITxReceipt,
  ITxReceiptStepProps,
  ITxStatus,
  ITxType,
  TAddress,
  TxQueryTypes,
  WalletId
} from '@types';
import { bigify, buildTxUrl, isWeb3Wallet, truncate } from '@utils';
import { constructCancelTxQuery, constructSpeedUpTxQuery } from '@utils/queries';
import { path } from '@vendor';

import { FromToAccount, TransactionDetailsDisplay } from './displays';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import {
  calculateReplacementGasPrice,
  constructSenderFromTxConfig,
  isContractInteraction
} from './helpers';
import { TxReceiptStatusBadge } from './TxReceiptStatusBadge';
import { TxReceiptTotals } from './TxReceiptTotals';
import { ISender } from './types';
import './TxReceipt.scss';

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}
interface Props {
  pendingButton?: PendingBtnAction;
  disableDynamicTxReceiptDisplay?: boolean;
  disableAddTxToAccount?: boolean;
  queryStringsDisabled?: boolean;
  customBroadcastText?: string;
  protectTxButton?(): JSX.Element;
  customComponent?(): JSX.Element;
}

const SSpacer = styled.div`
  height: 60px;
  @media screen and (max-width: ${BREAK_POINTS.SCREEN_XS}) {
    height: 85px;
  }
`;

const TxReceipt = ({
  txReceipt,
  txConfig,
  txQueryType,
  completeButton,
  customComponent,
  customBroadcastText,
  disableDynamicTxReceiptDisplay,
  disableAddTxToAccount,
  history,
  resetFlow,
  protectTxButton,
  queryStringsDisabled
}: ITxReceiptStepProps & RouteComponentProps & Props) => {
  const { getAssetRate } = useRates();
  const { getContactByAddressAndNetworkId } = useContacts();
  const { addTxToAccount } = useAccounts();
  const { assets } = useAssets();
  const { accounts } = useContext(StoreContext);
  const { settings } = useSettings();
  const [txStatus, setTxStatus] = useState(
    txReceipt ? txReceipt.status : (ITxStatus.PENDING as ITxHistoryStatus)
  );
  const [displayTxReceipt, setDisplayTxReceipt] = useState<ITxReceipt | undefined>(txReceipt);
  const [blockNumber, setBlockNumber] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  // Imported in this way to handle errors where the context is missing, f.x. in Swap Flow
  const { state: ptxState } = useContext(ProtectTxContext);

  useEffect(() => {
    if (!disableDynamicTxReceiptDisplay) {
      setDisplayTxReceipt(txReceipt);
    }
  }, [setDisplayTxReceipt, txReceipt]);

  useEffect(() => {
    if (displayTxReceipt && blockNumber === 0 && displayTxReceipt.hash) {
      const provider = new ProviderHandler(txConfig.network);
      const blockNumInterval = setInterval(() => {
        getTransactionReceiptFromHash(displayTxReceipt.hash, provider).then(
          (transactionOutcome) => {
            if (transactionOutcome) {
              const transactionStatus: ITxHistoryStatus =
                transactionOutcome.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
              setTxStatus((prevStatusState) => transactionStatus || prevStatusState);
              setBlockNumber((prevState: number) => transactionOutcome.blockNumber || prevState);
              provider.getTransactionByHash(displayTxReceipt.hash).then((txResponse) => {
                setDisplayTxReceipt(
                  makeFinishedTxReceipt(
                    txReceipt as IPendingTxReceipt,
                    transactionStatus,
                    txResponse.timestamp,
                    txResponse.blockNumber,
                    transactionOutcome.gasUsed,
                    transactionOutcome.confirmations
                  )
                );
              });
            } else if (txStatus === ITxStatus.UNKNOWN) {
              setTxStatus(ITxStatus.PENDING);
            }
          }
        );
      }, 1000);
      return () => clearInterval(blockNumInterval);
    }
  });
  useEffect(() => {
    if (displayTxReceipt && timestamp === 0 && blockNumber !== 0) {
      const provider = new ProviderHandler(txConfig.network);
      const timestampInterval = setInterval(() => {
        getTimestampFromBlockNum(blockNumber, provider).then((transactionTimestamp) => {
          if (txReceipt && txReceipt.txType === ITxType.FAUCET) {
            const recipientAccount = getStoreAccount(accounts)(txReceipt.to, txConfig.network.id);
            if (recipientAccount) {
              addTxToAccount(recipientAccount, {
                ...displayTxReceipt,
                blockNumber: blockNumber || 0,
                timestamp: transactionTimestamp || 0,
                status: txStatus
              });
            }
          } else if (sender.account && !disableAddTxToAccount) {
            addTxToAccount(sender.account, {
              ...displayTxReceipt,
              blockNumber: blockNumber || 0,
              timestamp: transactionTimestamp || 0,
              status: txStatus
            });
          }
          setTimestamp(transactionTimestamp || 0);
        });
      }, 1000);

      return () => clearInterval(timestampInterval);
    }
  });

  const assetRate = (() => {
    if (displayTxReceipt && path(['asset'], displayTxReceipt)) {
      return getAssetRate(displayTxReceipt.asset);
    } else {
      return getAssetRate(txConfig.asset);
    }
  })();

  const baseAssetRate = (() => {
    if (displayTxReceipt && path(['baseAsset'], displayTxReceipt)) {
      return getAssetRate(displayTxReceipt.baseAsset);
    } else {
      return getAssetRate(txConfig.baseAsset);
    }
  })();

  const handleTxSpeedUpRedirect = async () => {
    if (!txConfig) return;
    const { fast } = await fetchGasPriceEstimates(txConfig.network);
    const query = constructSpeedUpTxQuery(
      txConfig,
      calculateReplacementGasPrice(txConfig, bigify(fast))
    );
    history.replace(`${ROUTE_PATHS.SEND.path}/?${query}`);
  };

  const handleTxCancelRedirect = async () => {
    if (!txConfig) return;
    const { fast } = await fetchGasPriceEstimates(txConfig.network);
    const query = constructCancelTxQuery(
      txConfig,
      calculateReplacementGasPrice(txConfig, bigify(fast))
    );
    history.replace(`${ROUTE_PATHS.SEND.path}/?${query}`);
  };

  const sender = constructSenderFromTxConfig(txConfig, accounts);

  const senderContact = getContactByAddressAndNetworkId(sender.address, txConfig.network.id);

  const recipientContact = getContactByAddressAndNetworkId(
    txConfig.receiverAddress,
    txConfig.network.id
  );

  const contractName = (() => {
    const contact = getContactByAddressAndNetworkId(
      txConfig.rawTransaction.to,
      txConfig.network.id
    );
    if (contact) {
      return contact.label;
    }
    const asset = getAssetByContractAndNetwork(
      txConfig.rawTransaction.to,
      txConfig.network
    )(assets);
    return asset && asset.name;
  })();

  const txType = displayTxReceipt ? displayTxReceipt.txType : ITxType.STANDARD;

  const fiat = getFiat(settings);

  return (
    <TxReceiptUI
      settings={settings}
      txStatus={txStatus}
      timestamp={timestamp}
      senderContact={senderContact}
      sender={sender}
      recipientContact={recipientContact}
      contractName={contractName}
      displayTxReceipt={displayTxReceipt}
      protectTxEnabled={ptxState && ptxState.enabled}
      fiat={fiat}
      txConfig={txConfig}
      txReceipt={txReceipt}
      customComponent={customComponent}
      completeButton={completeButton}
      queryStringsDisabled={queryStringsDisabled}
      customBroadcastText={customBroadcastText}
      txQueryType={txQueryType}
      setDisplayTxReceipt={setDisplayTxReceipt}
      resetFlow={resetFlow}
      protectTxButton={protectTxButton}
      assetRate={assetRate}
      baseAssetRate={baseAssetRate}
      handleTxCancelRedirect={handleTxCancelRedirect}
      handleTxSpeedUpRedirect={handleTxSpeedUpRedirect}
      txType={txType}
    />
  );
};

export interface TxReceiptDataProps {
  settings: ISettings;
  txStatus: ITxStatus;
  timestamp: number;
  displayTxReceipt?: ITxReceipt;
  setDisplayTxReceipt?: Dispatch<SetStateAction<ITxReceipt | undefined>>;
  senderContact: ExtendedContact | undefined;
  sender: ISender;
  recipientContact: ExtendedContact | undefined;
  contractName?: string;
  fiat: Fiat;
  protectTxEnabled?: boolean;
  queryStringsDisabled?: boolean;
  customBroadcastText?: string;
  assetRate: number | undefined;
  baseAssetRate: number | undefined;
  handleTxCancelRedirect(): void;
  handleTxSpeedUpRedirect(): void;
  resetFlow(): void;
  completeButton?: string | (() => JSX.Element);
  protectTxButton?(): JSX.Element;
  customComponent?(): JSX.Element;
}

type UIProps = Omit<IStepComponentProps, 'resetFlow' | 'onComplete'> & TxReceiptDataProps;

export const TxReceiptUI = ({
  settings,
  txType,
  txConfig,
  txStatus,
  timestamp,
  assetRate,
  contractName,
  displayTxReceipt,
  setDisplayTxReceipt,
  customComponent,
  customBroadcastText,
  senderContact,
  sender,
  baseAssetRate,
  fiat,
  recipientContact,
  resetFlow,
  completeButton,
  txQueryType,
  handleTxCancelRedirect,
  handleTxSpeedUpRedirect,
  protectTxEnabled = false,
  queryStringsDisabled = false,
  protectTxButton
}: UIProps) => {
  const {
    asset,
    gasPrice,
    gasLimit,
    data,
    nonce,
    baseAsset,
    receiverAddress,
    rawTransaction
  } = txConfig;

  const walletConfig = getWalletConfig(sender.account ? sender.account.wallet : WalletId.VIEW_ONLY);
  const web3Wallet = isWeb3Wallet(walletConfig.id);
  const supportsResubmit = walletConfig.flags.supportsNonce;

  const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();
  const assetAmount = useCallback(() => {
    if (displayTxReceipt && path(['amount'], displayTxReceipt)) {
      return displayTxReceipt.amount;
    } else {
      return txConfig.amount;
    }
  }, [displayTxReceipt, txConfig.amount]);

  const mainAsset = useCallback(() => {
    if (displayTxReceipt && path(['asset'], displayTxReceipt)) {
      return displayTxReceipt.asset;
    } else {
      return txConfig.asset;
    }
  }, [displayTxReceipt, txConfig.asset]);

  const gasAmount = useCallback(() => {
    if (displayTxReceipt && path(['gasUsed'], displayTxReceipt)) {
      return displayTxReceipt.gasUsed!.toString();
    } else {
      return txConfig.gasLimit;
    }
  }, [displayTxReceipt]);

  const isContractCall = isContractInteraction(data, txType);

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
      {txStatus === ITxStatus.PENDING && (
        <div className="TransactionReceipt-row">
          <div className="TransactionReceipt-row-desc">
            {protectTxEnabled && !web3Wallet && <SSpacer />}
            {customBroadcastText || translate('TRANSACTION_BROADCASTED_DESC')}
          </div>
        </div>
      )}
      <FromToAccount
        networkId={sender.network.id}
        fromAccount={{
          address: (sender.address || (displayTxReceipt && displayTxReceipt.from)) as TAddress,
          addressBookEntry: senderContact
        }}
        toAccount={{
          address: (receiverAddress || (displayTxReceipt && displayTxReceipt.to)) as TAddress,
          addressBookEntry: recipientContact
        }}
        displayToAddress={txType !== ITxType.DEPLOY_CONTRACT}
      />

      {/* CONTRACT BOX */}

      {isContractCall && (
        <div className="TransactionReceipt-row">
          <TxIntermediaryDisplay address={rawTransaction.to} contractName={contractName} />
        </div>
      )}

      {/* CUSTOM FLOW CONTENT */}

      {customComponent && (
        <>
          {customComponent()}
          <div className="TransactionReceipt-divider" />
        </>
      )}

      <TxReceiptTotals
        asset={mainAsset()}
        assetAmount={assetAmount()}
        baseAsset={baseAsset}
        assetRate={assetRate}
        baseAssetRate={baseAssetRate}
        settings={settings}
        gasPrice={gasPrice}
        gasUsed={gasAmount()}
        value={rawTransaction.value}
      />

      <div className="TransactionReceipt-details-row">
        <div className="TransactionReceipt-details-row-column">
          <SubHeading color={COLORS.BLUE_GREY} m="0">
            {translate('TIMESTAMP')}
            {': '}
            <Body as="span" fontWeight="normal">
              {timestamp !== 0 && (
                <Tooltip display="inline" tooltip={<TimeElapsed value={timestamp} />}>
                  {localTimestamp}
                </Tooltip>
              )}
              {timestamp === 0 && translate('PENDING_STATE')}
            </Body>
          </SubHeading>
        </div>
        <Box display="flex" alignSelf="center" justifyContent="flex-end">
          <TxReceiptStatusBadge display="flex" status={txStatus} />
        </Box>
      </div>

      <div className="TransactionReceipt-details">
        <div className="TransactionReceipt-details-row">
          <div className="TransactionReceipt-details-row-column">
            <SubHeading color={COLORS.BLUE_GREY} m="0">
              {translate('TX_HASH')}
              {': '}
              <Body as="span" fontWeight="normal">
                {displayTxReceipt && txConfig.network && txConfig.network.blockExplorer && (
                  <Box display="inline-flex" variant="rowAlign" color={COLORS.BLUE_GREY}>
                    <Text as="span">{truncate(displayTxReceipt.hash)}</Text>
                    <LinkApp
                      href={buildTxUrl(txConfig.network.blockExplorer, displayTxReceipt.hash)}
                      isExternal={true}
                      variant="opacityLink"
                      display="inline-flex"
                    >
                      <Icon type="link-out" ml={'1ch'} height="1em" />
                    </LinkApp>
                  </Box>
                )}
                {!displayTxReceipt && translate('PENDING_STATE')}
              </Body>
            </SubHeading>
          </div>
        </div>

        {protectTxButton && protectTxButton()}

        <TransactionDetailsDisplay
          baseAsset={baseAsset}
          asset={asset}
          assetAmount={assetAmount()}
          confirmations={displayTxReceipt && displayTxReceipt.confirmations}
          gasUsed={displayTxReceipt && displayTxReceipt.gasUsed}
          data={data}
          sender={sender}
          gasLimit={gasLimit}
          gasPrice={gasPrice}
          nonce={nonce}
          rawTransaction={txConfig.rawTransaction}
          value={rawTransaction.value}
          fiat={fiat}
          baseAssetRate={baseAssetRate}
          assetRate={assetRate}
          status={txStatus}
          timestamp={timestamp}
          recipient={rawTransaction.to}
        />
      </div>
      {completeButton && !(txStatus === ITxStatus.PENDING) && (
        <>
          {typeof completeButton === 'string' ? (
            <Button secondary={true} className="TransactionReceipt-another" onClick={resetFlow}>
              {completeButton}
            </Button>
          ) : (
            completeButton()
          )}
        </>
      )}
      {txStatus === ITxStatus.PENDING &&
        txQueryType !== TxQueryTypes.SPEEDUP &&
        !queryStringsDisabled &&
        txConfig && (
          <Tooltip display="block" tooltip={translateRaw('SPEED_UP_TOOLTIP')}>
            <Button
              className="TransactionReceipt-another"
              onClick={handleTxSpeedUpRedirect}
              disabled={!supportsResubmit}
            >
              {translateRaw('SPEED_UP_TX_BTN')}
            </Button>
          </Tooltip>
        )}
      {txStatus === ITxStatus.PENDING &&
        txQueryType !== TxQueryTypes.CANCEL &&
        !queryStringsDisabled &&
        txConfig && (
          <Tooltip display="block" tooltip={translateRaw('SPEED_UP_TOOLTIP')}>
            <Button
              className="TransactionReceipt-another"
              onClick={handleTxCancelRedirect}
              disabled={!supportsResubmit}
            >
              {translateRaw('CANCEL_TX_BTN')}
            </Button>
          </Tooltip>
        )}
      <LinkApp href={ROUTE_PATHS.DASHBOARD.path}>
        <Button className="TransactionReceipt-back">
          {translate('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD')}
        </Button>
      </LinkApp>
      {txType === ITxType.DEFIZAP && <PoweredByText provider="ZAPPER" />}
    </div>
  );
};

export default withRouter(TxReceipt);
