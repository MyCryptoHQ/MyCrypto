import React, { useContext, useState } from 'react';

import BN from 'bn.js';
import Styled from 'styled-components';

import feeIcon from '@assets/images/icn-fee.svg';
import sendIcon from '@assets/images/icn-send.svg';
import walletIcon from '@assets/images/icn-wallet.svg';
import { Amount, AssetIcon, Button, PoweredByText } from '@components';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import { getFiat } from '@config/fiats';
import { IFeeAmount, ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { getAssetByContractAndNetwork, useAssets, useRates } from '@services';
import { StoreContext, useContacts, useSettings } from '@services/Store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ExtendedContact, ISettings, IStepComponentProps, ITxType } from '@types';
import { convertToFiat, fromWei, totalTxFeeToString, totalTxFeeToWei, Wei } from '@utils';

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
  @media (min-width: ${SCREEN_XS}) {
    font-size: 18px;
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
  protectTxButton,
  customComponent
}: UIProps) => {
  const {
    asset,
    gasPrice,
    gasLimit,
    value,
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

  const assetType = asset.type;

  /* Calculate Transaction Fee */
  const transactionFeeWei: BN = totalTxFeeToWei(gasPrice, gasLimit);
  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, gasLimit);

  /* Calculate total base asset amount */
  const valueWei = Wei(value);
  // @todo: BN math, add amount + maxCost !In same symbol
  const totalEtherEgress = parseFloat(fromWei(valueWei.add(transactionFeeWei), 'ether')).toFixed(6);

  const fiat = getFiat(settings);

  const isContractCall = data !== '0x' || (txType && isContractInteraction(txType));

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

      {customComponent && customComponent()}

      {customComponent && <div className="TransactionReceipt-divider" />}

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
            assetValue={`${parseFloat(amount).toFixed(6)} ${asset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(parseFloat(amount), assetRate).toFixed(2)
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
            assetValue={`${maxTransactionFeeBase} ${baseAsset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(parseFloat(maxTransactionFeeBase), baseAssetRate).toFixed(2)
            }}
          />
        </AmountWrapper>
      </RowWrapper>
      <Divider />
      <RowWrapper>
        <ColumnWrapper bold={true}>
          <img src={walletIcon} alt="Total" />
          {translate('TOTAL')}
        </ColumnWrapper>
        <AmountWrapper>
          {assetType === 'base' ? (
            <>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                assetValue={`${totalEtherEgress} ${asset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(parseFloat(totalEtherEgress), assetRate).toFixed(2)
                }}
              />
            </>
          ) : (
            <>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                assetValue={`${amount} ${asset.ticker}`}
                bold={true}
                baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: (
                    convertToFiat(parseFloat(amount), assetRate) +
                    convertToFiat(parseFloat(totalEtherEgress), baseAssetRate)
                  ).toFixed(2)
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
                assetValue={`${ptxFee.amount!.toFixed(6)} ${asset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(ptxFee.amount!.toNumber(), assetRate).toFixed(2)
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
                assetValue={`${ptxFee.fee!.toFixed(6)} ${asset.ticker}`}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(ptxFee.fee!.toNumber(), assetRate).toFixed(2)
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
        value={value}
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
      {txType === ITxType.DEFIZAP && (
        <DeFiZapLogoContainer>
          <PoweredByText provider="ZAPPER" />
        </DeFiZapLogoContainer>
      )}
    </ConfirmTransactionWrapper>
  );
};
