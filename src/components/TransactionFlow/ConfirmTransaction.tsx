import React, { useContext, useEffect, useState } from 'react';

import Styled from 'styled-components';

import feeIcon from '@assets/images/icn-fee.svg';
import sendIcon from '@assets/images/icn-send.svg';
import walletIcon from '@assets/images/icn-wallet.svg';
import { Amount, AssetIcon, Button, InlineMessage, PoweredByText } from '@components';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import { getFiat } from '@config/fiats';
import { IFeeAmount, ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { getAssetByContractAndNetwork, useAssets, useRates } from '@services';
import { StoreContext, useContacts, useSettings } from '@services/Store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ExtendedContact, ISettings, IStepComponentProps, ITxType } from '@types';
import { bigify, convertToFiat, fromWei, totalTxFeeToString, totalTxFeeToWei, Wei } from '@utils';

import { FromToAccount } from './displays';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import { constructSenderFromTxConfig, isContractInteraction } from './helpers';
import { ISender } from './types';

const { SCREEN_XS } = BREAK_POINTS;

const ConfirmTransactionWrapper = Styled.div`
  text-align: left;
`;

const RowWrapper = Styled.div<{ stack?: boolean }>`
  display: flex;
  margin-bottom: 24px;
  flex-direction: ${(props) => (props.stack ? 'column' : 'row')};
  @media (min-width: ${SCREEN_XS}) {
    flex-direction: row;
    align-items: center;
  }
`;

const ColumnWrapper = Styled.div<{ bold?: boolean }>`
  font-size: 16px;
  flex: 1;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  @media (min-width: ${SCREEN_XS}) {
    margin-bottom: 0;
  }
  img {
    width: auto;
    height: 25px;
    margin-right: 10px;
  }
  svg {
    width: auto;
    height: 25px;
    margin-right: 10px;
    vertical-align: middle;
  }
`;

const SendButton = Styled(Button)`
  > div {
    justify-content: center;
  }
`;

const AmountWrapper = Styled(ColumnWrapper)`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  img {
    display: none;
    @media (min-width: ${SCREEN_XS}) {
      margin-right: 10px;
      display: block;
    }
  }
`;

const Divider = Styled.div`
  height: 1px;
  margin-bottom: 20px;
  background: #e3edff;
`;

const DeFiZapLogoContainer = Styled.div`
  margin-top: ${SPACING.BASE};
`;
const DeFiDisclaimerWrapper = Styled.p`
  color: ${COLORS.GREY};
  margin-bottom: ${SPACING.MD};
`;

const PTXWrapper = Styled.div`
  background-color: ${COLORS.GREY_LIGHTEST};
  padding: ${SPACING.SM};
`;

const PTXHeader = Styled.p`
  text-align: center;
  color: ${COLORS.BLUE_GREY};
  text-transform: uppercase;
  font-size: ${FONT_SIZE.XS};
  font-weight: bold;
  margin-bottom: ${SPACING.BASE};
`;

export default function ConfirmTransaction({
  txType = ITxType.STANDARD,
  txConfig,
  onComplete,
  signedTx,
  error,
  protectTxButton,
  customComponent
}: IStepComponentProps & { protectTxButton?(): JSX.Element; customComponent?(): JSX.Element }) {
  const { asset, baseAsset, receiverAddress, network, from, rawTransaction } = txConfig;

  const { getContactByAddressAndNetworkId } = useContacts();
  const { getAssetRate } = useRates();
  const { assets } = useAssets();
  const { accounts } = useContext(StoreContext);
  const { settings } = useSettings();
  const { state: ptxState } = useContext(ProtectTxContext);
  const ptxFee = (() => {
    if (ptxState && ptxState.enabled && !ptxState.isPTXFree) {
      return ptxState.feeAmount;
    }
    return undefined;
  })();
  /* Get contact info */
  const recipientContact = getContactByAddressAndNetworkId(receiverAddress, network.id);
  const senderContact = getContactByAddressAndNetworkId(from, network.id);
  const sender = constructSenderFromTxConfig(txConfig, accounts);

  /* Get Rates */
  const assetRate = getAssetRate(asset);
  const baseAssetRate = getAssetRate(baseAsset);

  const contractName = (() => {
    const contact = getContactByAddressAndNetworkId(rawTransaction.to, network.id);
    if (contact) {
      return contact.label;
    }
    const asset = getAssetByContractAndNetwork(rawTransaction.to, network)(assets);
    return asset && asset.name;
  })();

  return (
    <ConfirmTransactionUI
      settings={settings}
      assetRate={assetRate}
      baseAssetRate={baseAssetRate}
      senderContact={senderContact}
      sender={sender}
      txType={txType}
      txConfig={txConfig}
      recipientContact={recipientContact}
      contractName={contractName}
      onComplete={onComplete}
      signedTx={signedTx}
      ptxFee={ptxFee}
      protectTxButton={protectTxButton}
      customComponent={customComponent}
      error={error}
    />
  );
}

interface DataProps {
  settings: ISettings;
  assetRate?: number;
  baseAssetRate?: number;
  recipientContact?: ExtendedContact;
  senderContact?: ExtendedContact;
  sender: ISender;
  contractName?: string;
  ptxFee?: IFeeAmount;
  protectTxButton?(): JSX.Element;
  customComponent?(): JSX.Element;
}

type UIProps = Omit<IStepComponentProps, 'resetFlow'> & DataProps;

export const ConfirmTransactionUI = ({
  settings,
  assetRate,
  baseAssetRate,
  senderContact,
  sender,
  recipientContact,
  contractName,
  txType,
  txConfig,
  onComplete,
  signedTx,
  ptxFee,
  error,
  protectTxButton,
  customComponent
}: UIProps) => {
  const {
    asset,
    gasPrice,
    gasLimit,
    amount,
    receiverAddress,
    nonce,
    data,
    baseAsset,
    rawTransaction
  } = txConfig;
  const [isBroadcastingTx, setIsBroadcastingTx] = useState(false);
  const handleApprove = () => {
    setIsBroadcastingTx(true);
    onComplete(null);
  };

  useEffect(() => {
    error && setIsBroadcastingTx(false);
  }, [error]);

  const assetType = asset.type;

  /* Calculate Transaction Fee */
  const transactionFeeWei = totalTxFeeToWei(rawTransaction.gasPrice, rawTransaction.gasLimit);
  const maxTransactionFeeBase: string = totalTxFeeToString(
    rawTransaction.gasPrice,
    rawTransaction.gasLimit
  );

  /* Calculate total base asset amount */
  const valueWei = Wei(rawTransaction.value);
  // @todo: BN math, add amount + maxCost !In same symbol
  const totalEtherEgress = bigify(fromWei(valueWei.plus(transactionFeeWei), 'ether')).toFixed(6);

  const fiat = getFiat(settings);

  const isContractCall = isContractInteraction(data, txType);

  return (
    <ConfirmTransactionWrapper>
      <FromToAccount
        networkId={sender.network.id}
        fromAccount={{
          address: sender.address,
          addressBookEntry: senderContact
        }}
        toAccount={{
          address: receiverAddress,
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

      <RowWrapper>
        <ColumnWrapper>
          <img src={sendIcon} alt="Send" />
          {txType === ITxType.DEFIZAP
            ? translate('ZAP_CONFIRM_TX_SENDING')
            : translate('CONFIRM_TX_SENDING')}
        </ColumnWrapper>
        <AmountWrapper>
          <AssetIcon uuid={asset.uuid} size={'25px'} />
          <Amount
            fiatColor={COLORS.BLUE_SKY}
            assetValue={`${bigify(amount).toFixed(6)} ${asset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(bigify(amount), assetRate).toFixed(2)
            }}
          />
        </AmountWrapper>
      </RowWrapper>
      <RowWrapper>
        <ColumnWrapper>
          <img src={feeIcon} alt="Fee" /> {translate('CONFIRM_TX_FEE')}
        </ColumnWrapper>
        <AmountWrapper>
          <AssetIcon uuid={baseAsset.uuid} size={'25px'} />
          <Amount
            fiatColor={COLORS.BLUE_SKY}
            assetValue={`${maxTransactionFeeBase} ${baseAsset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(maxTransactionFeeBase, baseAssetRate).toFixed(2)
            }}
          />
        </AmountWrapper>
      </RowWrapper>
      <Divider />
      <RowWrapper>
        <ColumnWrapper>
          <img src={walletIcon} alt="Total" />
          {translate('TOTAL')}
        </ColumnWrapper>
        <AmountWrapper>
          {assetType === 'base' ? (
            <>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                fiatColor={COLORS.BLUE_SKY}
                assetValue={`${totalEtherEgress} ${asset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(totalEtherEgress, assetRate).toFixed(2)
                }}
              />
            </>
          ) : (
            <>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                fiatColor={COLORS.BLUE_SKY}
                assetValue={`${amount} ${asset.ticker}`}
                baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(amount, assetRate)
                    .plus(convertToFiat(totalEtherEgress, baseAssetRate))
                    .toFixed(2)
                }}
              />
            </>
          )}
        </AmountWrapper>
      </RowWrapper>
      {ptxFee && (
        <PTXWrapper>
          <PTXHeader>{translateRaw('PROTECTED_TX_RECEIPT_HEADER')}</PTXHeader>
          <RowWrapper>
            <ColumnWrapper>
              <ProtectIconCheck size="sm" />
              {translate('PROTECTED_TX_PRICE')}
            </ColumnWrapper>
            <AmountWrapper>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                fiatColor={COLORS.BLUE_SKY}
                assetValue={`${ptxFee.amount!.toFixed(6)} ${asset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(ptxFee.amount!, assetRate).toFixed(2)
                }}
              />
            </AmountWrapper>
          </RowWrapper>
          <RowWrapper>
            <ColumnWrapper>
              <img src={feeIcon} alt="Fee" />
              {translate('PROTECTED_TX_FEE')}
            </ColumnWrapper>
            <AmountWrapper>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                fiatColor={COLORS.BLUE_SKY}
                assetValue={`${ptxFee.fee!.toFixed(6)} ${asset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(ptxFee.fee!, assetRate).toFixed(2)
                }}
              />
            </AmountWrapper>
          </RowWrapper>
        </PTXWrapper>
      )}
      <TransactionDetailsDisplay
        baseAsset={baseAsset}
        asset={asset}
        assetAmount={amount}
        value={rawTransaction.value}
        data={data}
        sender={sender}
        gasLimit={gasLimit}
        gasPrice={gasPrice}
        nonce={nonce}
        signedTransaction={signedTx}
        fiat={fiat}
        baseAssetRate={baseAssetRate}
        assetRate={assetRate}
        rawTransaction={rawTransaction}
        recipient={rawTransaction.to}
      />
      {txType === ITxType.DEFIZAP && (
        <DeFiDisclaimerWrapper>{translate('ZAP_CONFIRM_DISCLAIMER')}</DeFiDisclaimerWrapper>
      )}
      {protectTxButton && protectTxButton()}
      <SendButton
        onClick={handleApprove}
        disabled={isBroadcastingTx}
        className="ConfirmTransaction-button"
        loading={isBroadcastingTx}
        fullwidth={true}
      >
        {isBroadcastingTx ? translateRaw('SUBMITTING') : translateRaw('CONFIRM_AND_SEND')}
      </SendButton>
      {error && (
        <InlineMessage>
          {translate('GAS_LIMIT_ESTIMATION_ERROR_MESSAGE', { $error: error })}
        </InlineMessage>
      )}
      {txType === ITxType.DEFIZAP && (
        <DeFiZapLogoContainer>
          <PoweredByText provider="ZAPPER" />
        </DeFiZapLogoContainer>
      )}
    </ConfirmTransactionWrapper>
  );
};
