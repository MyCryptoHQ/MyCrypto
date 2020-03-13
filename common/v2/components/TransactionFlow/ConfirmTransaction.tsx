import React, { useContext, useState } from 'react';
import Styled from 'styled-components';
import BN from 'bn.js';
import { Button } from '@mycrypto/ui';

import { AddressBookContext, StoreContext } from 'v2/services/Store';
import { Amount, AssetIcon } from 'v2/components';
import { fromWei, Wei, totalTxFeeToString, totalTxFeeToWei } from 'v2/services/EthService';
import { RatesContext } from 'v2/services/RatesProvider';
import { IStepComponentProps, ExtendedAddressBook, ITxType } from 'v2/types';
import { BREAK_POINTS, SPACING, COLORS } from 'v2/theme';
import { convertToFiat } from 'v2/utils';
import translate, { translateRaw } from 'v2/translations';
import { TSymbol } from 'v2/types/symbols';
import { ZapSelectedBanner, DeFiZapLogo } from 'v2/features/DeFiZap';

import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import { FromToAccount } from './displays';
import { constructSenderFromTxConfig } from './helpers';
import { ISender } from './types';

import feeIcon from 'common/assets/images/icn-fee.svg';
import sendIcon from 'common/assets/images/icn-send.svg';
import walletIcon from 'common/assets/images/icn-wallet.svg';

const { SCREEN_XS } = BREAK_POINTS;

const ConfirmTransactionWrapper = Styled.div`
  text-align: left;
`;

const RowWrapper = Styled.div<{ stack?: boolean }>`
  display: flex;
  margin-bottom: 24px;
  flex-direction: ${props => (props.stack ? 'column' : 'row')};
  @media (min-width: ${SCREEN_XS}) {
    flex-direction: row;
    align-items: center;
  }
`;

const ColumnWrapper = Styled.div<{ bold?: boolean }>`
  font-size: 16px;
  flex: 1;
  font-weight: ${props => (props.bold ? 'bold' : 'normal')};
  @media (min-width: ${SCREEN_XS}) {
    margin-bottom: 0;
  }
  @media (min-width: ${SCREEN_XS}) {
    font-size: 18px;
  }
  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
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

const SendButton = Styled(Button)`
  width: 100%;
`;

const DeFiZapLogoContainer = Styled.div`
  margin-top: ${SPACING.BASE};
`;
const DeFiDisclaimerWrapper = Styled.p`
  color: ${COLORS.GREY};
  margin-bottom: ${SPACING.MD};
`;

export default function ConfirmTransaction({
  txType = ITxType.STANDARD,
  membershipSelected,
  zapSelected,
  txConfig,
  onComplete,
  signedTx
}: IStepComponentProps) {
  const { asset, baseAsset, receiverAddress, network, from } = txConfig;

  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);
  const { getAssetRate } = useContext(RatesContext);
  const { accounts } = useContext(StoreContext);
  /* Get contact info */
  const recipientContact = getContactByAddressAndNetworkId(receiverAddress, network.id);
  const senderContact = getContactByAddressAndNetworkId(from, network.id);
  const sender = constructSenderFromTxConfig(txConfig, accounts);

  /* Get Rates */
  const assetRate = getAssetRate(asset);
  const baseAssetRate = getAssetRate(baseAsset);

  return (
    <ConfirmTransactionUI
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
    />
  );
}

interface DataProps {
  assetRate?: number;
  baseAssetRate?: number;
  recipientContact?: ExtendedAddressBook;
  senderContact?: ExtendedAddressBook;
  sender: ISender;
}

export const ConfirmTransactionUI = ({
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
  signedTx
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
  // @TODO: BN math, add amount + maxCost !In same symbol
  const totalEtherEgress = parseFloat(fromWei(valueWei.add(transactionFeeWei), 'ether')).toFixed(6);
  const senderAccountLabel = senderContact ? senderContact.label : 'Unknown Account';
  const recipientLabel = recipientContact ? recipientContact.label : 'Unknown Address';

  return (
    <ConfirmTransactionWrapper>
      {txType === ITxType.DEFIZAP && zapSelected && <ZapSelectedBanner zapSelected={zapSelected} />}
      <FromToAccount
        from={{
          address: sender.address,
          label: senderAccountLabel
        }}
        to={{
          address: (receiverAddress || 'Unknown') as never,
          label: recipientLabel
        }}
        displayToAddress={txType !== ITxType.DEFIZAP}
      />
      {txType === ITxType.DEFIZAP && zapSelected && (
        <RowWrapper>
          <TxIntermediaryDisplay address={zapSelected.contractAddress} contractName={'DeFi Zap'} />
        </RowWrapper>
      )}
      {assetType === 'erc20' && asset && asset.contractAddress && (
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
          {translate(txType === ITxType.DEFIZAP ? 'ZAP_CONFIRM_TX_SENDING' : 'CONFIRM_TX_SENDING')}
        </ColumnWrapper>
        <AmountWrapper>
          <AssetIcon symbol={asset.ticker as TSymbol} size={'30px'} />
          <Amount
            assetValue={`${parseFloat(amount).toFixed(6)} ${asset.ticker}`}
            fiatValue={`$${convertToFiat(parseFloat(amount), assetRate).toFixed(2)}
          `}
          />
        </AmountWrapper>
      </RowWrapper>
      <RowWrapper>
        <ColumnWrapper>
          <img src={feeIcon} alt="Fee" /> {translate('CONFIRM_TX_FEE')}
        </ColumnWrapper>
        <AmountWrapper>
          <AssetIcon symbol={asset.ticker as TSymbol} size={'30px'} />
          <Amount
            assetValue={`${maxTransactionFeeBase} ${baseAsset.ticker}`}
            fiatValue={`$${convertToFiat(parseFloat(maxTransactionFeeBase), baseAssetRate).toFixed(
              2
            )}`}
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
              <AssetIcon symbol={asset.ticker as TSymbol} size={'30px'} />
              <Amount
                assetValue={`${totalEtherEgress} ${asset.ticker}`}
                fiatValue={`$${convertToFiat(parseFloat(totalEtherEgress), assetRate).toFixed(2)}`}
              />
            </>
          ) : (
            <>
              <AssetIcon symbol={asset.ticker as TSymbol} size={'30px'} />
              <Amount
                assetValue={`${amount} ${asset.ticker}`}
                bold={true}
                baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
                fiatValue={`$${(
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
        <DeFiDisclaimerWrapper>{translateRaw('ZAP_CONFIRM_DISCLAIMER')}</DeFiDisclaimerWrapper>
      )}
      <SendButton
        onClick={handleApprove}
        disabled={isBroadcastingTx}
        className="ConfirmTransaction-button"
      >
        {isBroadcastingTx ? translate('SUBMITTING') : translate('CONFIRM_AND_SEND')}
      </SendButton>
      {txType === ITxType.DEFIZAP && (
        <DeFiZapLogoContainer>
          <DeFiZapLogo />
        </DeFiZapLogoContainer>
      )}
    </ConfirmTransactionWrapper>
  );
};
