import React, { useContext, useState } from 'react';
import Styled from 'styled-components';
import BN from 'bn.js';

import { AddressBookContext, StoreContext, SettingsContext } from '@services/Store';
import { Amount, AssetIcon, Button, PoweredByText } from '@components';
import { fromWei, Wei, totalTxFeeToString, totalTxFeeToWei } from '@services/EthService';
import { RatesContext } from '@services/RatesProvider';
import { convertToFiat } from '@utils';
import translate, { translateRaw } from '@translations';
import { ZapSelectedBanner } from '@features/DeFiZap';
import { BREAK_POINTS, SPACING, COLORS } from '@theme';
import MembershipSelectedBanner from '@features/PurchaseMembership/components/MembershipSelectedBanner';
import { PoweredByProvider } from '@components/PoweredByText';
import { IStepComponentProps, ITxType, ExtendedAddressBook, ISettings } from '@types';
import { getFiat } from '@config/fiats';

import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import { FromToAccount } from './displays';
import { constructSenderFromTxConfig } from './helpers';
import { ISender } from './types';

import feeIcon from '@assets/images/icn-fee.svg';
import sendIcon from '@assets/images/icn-send.svg';
import walletIcon from '@assets/images/icn-wallet.svg';

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

interface Props extends IStepComponentProps {
  protectTxButton?(): JSX.Element;
}

export default function ConfirmTransaction({
  txType = ITxType.STANDARD,
  membershipSelected,
  zapSelected,
  txConfig,
  onComplete,
  signedTx,
  protectTxButton
}: Props) {
  const { asset, baseAsset, receiverAddress, network, from } = txConfig;

  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);
  const { getAssetRate } = useContext(RatesContext);
  const { accounts } = useContext(StoreContext);
  const { settings } = useContext(SettingsContext);
  /* Get contact info */
  const recipientContact = getContactByAddressAndNetworkId(receiverAddress, network.id);
  const senderContact = getContactByAddressAndNetworkId(from, network.id);
  const sender = constructSenderFromTxConfig(txConfig, accounts);

  /* Get Rates */
  const assetRate = getAssetRate(asset);
  const baseAssetRate = getAssetRate(baseAsset);

  return (
    <ConfirmTransactionUI
      settings={settings}
      assetRate={assetRate}
      baseAssetRate={baseAssetRate}
      senderContact={senderContact}
      sender={sender}
      txType={txType}
      zapSelected={zapSelected}
      membershipSelected={membershipSelected}
      txConfig={txConfig}
      recipientContact={recipientContact}
      onComplete={onComplete}
      signedTx={signedTx}
      protectTxButton={protectTxButton}
    />
  );
}

interface DataProps {
  settings: ISettings;
  assetRate?: number;
  baseAssetRate?: number;
  recipientContact?: ExtendedAddressBook;
  senderContact?: ExtendedAddressBook;
  sender: ISender;
  protectTxButton?(): JSX.Element;
}

export const ConfirmTransactionUI = ({
  settings,
  assetRate,
  baseAssetRate,
  senderContact,
  sender,
  recipientContact,
  zapSelected,
  membershipSelected,
  txType,
  txConfig,
  onComplete,
  signedTx,
  protectTxButton
}: Omit<IStepComponentProps, 'resetFlow'> & DataProps) => {
  const {
    asset,
    gasPrice,
    gasLimit,
    value,
    amount,
    receiverAddress,
    nonce,
    data,
    baseAsset
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
  const senderAccountLabel = senderContact ? senderContact.label : 'Unknown Account';
  const recipientLabel = recipientContact ? recipientContact.label : 'Unknown Address';

  return (
    <ConfirmTransactionWrapper>
      {txType === ITxType.DEFIZAP && zapSelected && <ZapSelectedBanner zapSelected={zapSelected} />}
      {txType === ITxType.PURCHASE_MEMBERSHIP && membershipSelected && (
        <MembershipSelectedBanner membershipSelected={membershipSelected} />
      )}
      <FromToAccount
        from={{
          address: sender.address,
          label: senderAccountLabel
        }}
        to={{
          address: (receiverAddress || 'Unknown') as never,
          label: recipientLabel
        }}
        displayToAddress={txType !== ITxType.DEFIZAP && txType !== ITxType.PURCHASE_MEMBERSHIP}
      />
      {txType === ITxType.DEFIZAP && zapSelected && (
        <RowWrapper>
          <TxIntermediaryDisplay address={zapSelected.contractAddress} contractName={'DeFi Zap'} />
        </RowWrapper>
      )}
      {assetType === 'erc20' &&
        asset &&
        asset.contractAddress &&
        txType !== ITxType.PURCHASE_MEMBERSHIP && (
          <RowWrapper>
            <TxIntermediaryDisplay address={asset.contractAddress} contractName={asset.ticker} />
          </RowWrapper>
        )}
      {txType === ITxType.PURCHASE_MEMBERSHIP && membershipSelected && (
        <RowWrapper>
          <TxIntermediaryDisplay
            address={membershipSelected.contractAddress}
            contractName={asset.ticker}
          />
        </RowWrapper>
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
            assetValue={`${parseFloat(amount).toFixed(6)} ${asset.ticker}`}
            fiatValue={`${getFiat(settings).symbol}${convertToFiat(
              parseFloat(amount),
              assetRate
            ).toFixed(2)}
          `}
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
            fiatValue={`${getFiat(settings).symbol}${convertToFiat(
              parseFloat(maxTransactionFeeBase),
              baseAssetRate
            ).toFixed(2)}`}
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
                fiatValue={`${getFiat(settings).symbol}${convertToFiat(
                  parseFloat(totalEtherEgress),
                  assetRate
                ).toFixed(2)}`}
              />
            </>
          ) : (
            <>
              <AssetIcon uuid={asset.uuid} size={'25px'} />
              <Amount
                assetValue={`${amount} ${asset.ticker}`}
                bold={true}
                baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
                fiatValue={`${getFiat(settings).symbol}${(
                  convertToFiat(parseFloat(amount), assetRate) +
                  convertToFiat(parseFloat(totalEtherEgress), baseAssetRate)
                ).toFixed(2)}`}
              />
            </>
          )}
        </AmountWrapper>
      </RowWrapper>
      <TransactionDetailsDisplay
        baseAsset={baseAsset}
        asset={asset}
        data={data}
        sender={sender}
        gasLimit={gasLimit}
        gasPrice={gasPrice}
        nonce={nonce}
        signedTransaction={signedTx}
      />
      {txType === ITxType.DEFIZAP && (
        <DeFiDisclaimerWrapper>{translate('ZAP_CONFIRM_DISCLAIMER')}</DeFiDisclaimerWrapper>
      )}
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
          <PoweredByText provider={PoweredByProvider.ZAPPER} />
        </DeFiZapLogoContainer>
      )}
      {protectTxButton && protectTxButton()}
    </ConfirmTransactionWrapper>
  );
};
