import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useState } from 'react';

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
import { useRates } from '@services';
import { ProviderHandler } from '@services/EthService';
import { useContacts, useNetworks, useSettings } from '@services/Store';
import { getContractName, getStoreAccounts, selectAccountTxs, useSelector } from '@store';
import { BREAK_POINTS, COLORS } from '@theme';
import translate, { translateRaw } from '@translations';
import {
  ExtendedContact,
  Fiat,
  IPendingTxReceipt,
  ISettings,
  IStepComponentProps,
  ITxReceipt,
  ITxReceiptStepProps,
  ITxStatus,
  ITxType,
  Network,
  TAddress,
  TxQueryTypes,
  WalletId
} from '@types';
import { buildTxUrl, isWeb3Wallet, truncate } from '@utils';
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
  signedTx,
  txQueryType,
  completeButton,
  customComponent,
  customBroadcastText,
  disableDynamicTxReceiptDisplay,
  history,
  resetFlow,
  protectTxButton,
  queryStringsDisabled
}: ITxReceiptStepProps & RouteComponentProps & Props) => {
  const { getAssetRate } = useRates();
  const { getContactByAddressAndNetworkId } = useContacts();
  const accounts = useSelector(getStoreAccounts);
  const { settings } = useSettings();
  const { getNetworkById } = useNetworks();

  const [receipt, setDisplayTxReceipt] = useState(txReceipt);

  const transactions = useSelector(selectAccountTxs);
  const userTx = transactions.find((t) => t.hash === receipt!.hash);
  const displayTxReceipt = userTx ?? receipt!;

  const timestamp = displayTxReceipt.timestamp ?? 0;
  const txStatus = displayTxReceipt.status ?? 0;

  const network = getNetworkById(txConfig.networkId);

  // Imported in this way to handle errors where the context is missing, f.x. in Swap Flow
  const { state: ptxState } = useContext(ProtectTxContext);

  useEffect(() => {
    if (!disableDynamicTxReceiptDisplay) {
      setDisplayTxReceipt(txReceipt);
    }
  }, [setDisplayTxReceipt, txReceipt]);

  useEffect(() => {
    // For user transactions all of this is handled by Redux
    if (userTx || displayTxReceipt.timestamp) {
      return;
    }
    const provider = new ProviderHandler(network);
    provider.waitForTransaction(displayTxReceipt.hash).then((receipt) => {
      const transactionStatus = receipt.status === 1 ? ITxStatus.SUCCESS : ITxStatus.FAILED;
      setDisplayTxReceipt(
        makeFinishedTxReceipt(
          displayTxReceipt as IPendingTxReceipt,
          transactionStatus,
          0,
          receipt.blockNumber ?? 0,
          receipt.gasUsed,
          receipt.confirmations
        )
      );

      if (receipt.blockNumber) {
        provider.getBlockByNumber(receipt.blockNumber).then(({ timestamp }) => {
          setDisplayTxReceipt(
            makeFinishedTxReceipt(
              displayTxReceipt as IPendingTxReceipt,
              transactionStatus,
              timestamp,
              receipt.blockNumber ?? 0,
              receipt.gasUsed,
              receipt.confirmations
            )
          );
        });
      }
    });
  }, []);

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
    const query = constructSpeedUpTxQuery(
      txConfig,
      await calculateReplacementGasPrice(txConfig, network)
    );
    history.replace(`${ROUTE_PATHS.SEND.path}/?${query}`);
  };

  const handleTxCancelRedirect = async () => {
    if (!txConfig) return;
    const query = constructCancelTxQuery(
      txConfig,
      await calculateReplacementGasPrice(txConfig, network)
    );
    history.replace(`${ROUTE_PATHS.SEND.path}/?${query}`);
  };

  const sender = constructSenderFromTxConfig(txConfig, accounts);

  const senderContact = getContactByAddressAndNetworkId(sender.address, network.id);

  const recipientContact =
    txConfig.receiverAddress &&
    getContactByAddressAndNetworkId(txConfig.receiverAddress, network.id);

  const contractName = useSelector(getContractName(network.id, txConfig.rawTransaction.to));

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
      network={network}
      signedTx={signedTx}
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
  network: Network;
}

type UIProps = Omit<IStepComponentProps, 'resetFlow' | 'onComplete'> & TxReceiptDataProps;

export const TxReceiptUI = ({
  settings,
  txType,
  txConfig,
  signedTx,
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
  protectTxButton,
  network
}: UIProps) => {
  const { asset, baseAsset, receiverAddress, rawTransaction } = txConfig;
  const { data, gasLimit, nonce } = rawTransaction;

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
      return txConfig.rawTransaction.gasLimit;
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
        networkId={sender.networkId}
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

      {rawTransaction.to && isContractCall && (
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
        rawTransaction={rawTransaction}
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
                {displayTxReceipt && network && network.blockExplorer && (
                  <Box display="inline-flex" variant="rowAlign" color={COLORS.BLUE_GREY}>
                    <Text as="span">{truncate(displayTxReceipt.hash)}</Text>
                    <LinkApp
                      href={buildTxUrl(network.blockExplorer, displayTxReceipt.hash)}
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
          nonce={nonce}
          rawTransaction={txConfig.rawTransaction}
          value={rawTransaction.value}
          fiat={fiat}
          baseAssetRate={baseAssetRate}
          assetRate={assetRate}
          status={txStatus}
          timestamp={timestamp}
          recipient={rawTransaction.to}
          network={network}
          signedTransaction={signedTx}
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
