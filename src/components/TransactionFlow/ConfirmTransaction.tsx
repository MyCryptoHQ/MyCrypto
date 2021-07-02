import { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Amount, Button, InlineMessage, PoweredByText } from '@components';
import Icon from '@components/Icon';
import ProtectIconCheck from '@components/icons/ProtectIconCheck';
import { getFiat } from '@config/fiats';
import { IFeeAmount, ProtectTxContext } from '@features/ProtectTransaction/ProtectTxProvider';
import { getAssetByContractAndNetwork, useAssets, useRates } from '@services';
import { useContacts, useNetworks, useSettings } from '@services/Store';
import { getStoreAccounts, useSelector } from '@store';
import { BREAK_POINTS, COLORS, FONT_SIZE, SPACING } from '@theme';
import translate, { translateRaw } from '@translations';
import { ExtendedContact, ISettings, IStepComponentProps, ITxType, Network } from '@types';
import {
  bigify,
  convertToFiat,
  fromWei,
  isType2Tx,
  totalTxFeeToString,
  totalTxFeeToWei,
  Wei
} from '@utils';

import { FromToAccount } from './displays';
import TransactionDetailsDisplay from './displays/TransactionDetailsDisplay';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import { constructSenderFromTxConfig, isContractInteraction } from './helpers';
import { ISender } from './types';

const { SCREEN_XS } = BREAK_POINTS;

const ConfirmTransactionWrapper = styled.div`
  text-align: left;
`;

const RowWrapper = styled.div<{ stack?: boolean }>`
  display: flex;
  margin-bottom: 24px;
  flex-direction: ${(props) => (props.stack ? 'column' : 'row')};
  @media (min-width: ${SCREEN_XS}) {
    flex-direction: row;
    align-items: center;
  }
`;

const ColumnWrapper = styled.div<{ bold?: boolean }>`
  font-size: 16px;
  flex: 1;
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
  @media (min-width: ${SCREEN_XS}) {
    margin-bottom: 0;
  }
`;

const SIcon = styled(Icon)`
  height: 25px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    display: none;
  }
`;

const SendButton = styled(Button)`
  > div {
    justify-content: center;
  }
`;

const Divider = styled.div`
  height: 1px;
  margin-bottom: 20px;
  background: #e3edff;
`;

const DeFiZapLogoContainer = styled.div`
  margin-top: ${SPACING.BASE};
`;
const DeFiDisclaimerWrapper = styled.p`
  color: ${COLORS.GREY};
  margin-bottom: ${SPACING.MD};
`;

const PTXWrapper = styled.div`
  background-color: ${COLORS.GREY_LIGHTEST};
  padding: ${SPACING.SM};
`;

const PTXHeader = styled.p`
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
  const { asset, baseAsset, receiverAddress, networkId, from, rawTransaction } = txConfig;

  const { getContactByAddressAndNetworkId } = useContacts();
  const { getAssetRate } = useRates();
  const { assets } = useAssets();
  const accounts = useSelector(getStoreAccounts);
  const { settings } = useSettings();
  const { getNetworkById } = useNetworks();
  const network = getNetworkById(networkId);
  const { state: ptxState } = useContext(ProtectTxContext);
  const ptxFee = (() => {
    if (ptxState && ptxState.enabled && !ptxState.isPTXFree) {
      return ptxState.feeAmount;
    }
    return undefined;
  })();
  /* Get contact info */
  const recipientContact =
    receiverAddress && getContactByAddressAndNetworkId(receiverAddress, network.id);
  const senderContact = getContactByAddressAndNetworkId(from, network.id);
  const sender = constructSenderFromTxConfig(txConfig, accounts);

  /* Get Rates */
  const assetRate = getAssetRate(asset);
  const baseAssetRate = getAssetRate(baseAsset);

  const contractName = (() => {
    const contact =
      rawTransaction.to && getContactByAddressAndNetworkId(rawTransaction.to, network.id);
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
      network={network}
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
  network: Network;
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
  customComponent,
  network
}: UIProps) => {
  const { asset, amount, receiverAddress, baseAsset, rawTransaction } = txConfig;
  const { nonce, data, gasLimit } = rawTransaction;
  const [isBroadcastingTx, setIsBroadcastingTx] = useState(false);
  const handleApprove = () => {
    setIsBroadcastingTx(true);
    onComplete(null);
  };

  useEffect(() => {
    error && setIsBroadcastingTx(false);
  }, [error]);

  const assetType = asset.type;

  const gasPrice = isType2Tx(rawTransaction)
    ? rawTransaction.maxFeePerGas
    : rawTransaction.gasPrice;

  /* Calculate Transaction Fee */
  const transactionFeeWei = totalTxFeeToWei(gasPrice, rawTransaction.gasLimit);
  const maxTransactionFeeBase: string = totalTxFeeToString(gasPrice, rawTransaction.gasLimit);

  /* Calculate total base asset amount */
  const valueWei = Wei(rawTransaction.value);
  // @todo: BN math, add amount + maxCost !In same symbol
  const totalEtherEgress = bigify(fromWei(valueWei.plus(transactionFeeWei), 'ether')).toFixed(6);

  const fiat = getFiat(settings);

  const isContractCall = isContractInteraction(data, txType);

  return (
    <ConfirmTransactionWrapper>
      <FromToAccount
        networkId={sender.networkId}
        fromAccount={{
          address: sender.address,
          addressBookEntry: senderContact
        }}
        toAccount={{
          address: receiverAddress!,
          addressBookEntry: recipientContact
        }}
        displayToAddress={receiverAddress && txType !== ITxType.DEPLOY_CONTRACT}
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

      <RowWrapper>
        <ColumnWrapper>
          <SIcon type="tx-send" alt="Send" />
          {txType === ITxType.DEFIZAP
            ? translate('ZAP_CONFIRM_TX_SENDING')
            : translate('CONFIRM_TX_SENDING')}
        </ColumnWrapper>
        <ColumnWrapper>
          <Amount
            asset={{
              amount: bigify(amount).toFixed(6),
              ticker: asset.ticker,
              uuid: asset.uuid
            }}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(bigify(amount), assetRate).toFixed(2)
            }}
          />
        </ColumnWrapper>
      </RowWrapper>
      <RowWrapper>
        <ColumnWrapper>
          <SIcon type="tx-fee" alt="Fee" />
          {translate('CONFIRM_TX_FEE')}
        </ColumnWrapper>
        <ColumnWrapper>
          <Amount
            asset={{
              amount: maxTransactionFeeBase,
              ticker: baseAsset.ticker,
              uuid: baseAsset.uuid
            }}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(maxTransactionFeeBase, baseAssetRate).toFixed(2)
            }}
          />
        </ColumnWrapper>
      </RowWrapper>
      <Divider />
      <RowWrapper>
        <ColumnWrapper>
          <SIcon type="tx-sent" alt="Total" />
          {translate('TOTAL')}
        </ColumnWrapper>
        <ColumnWrapper>
          {assetType === 'base' ? (
            <Amount
              asset={{
                amount: totalEtherEgress,
                ticker: asset.ticker,
                uuid: asset.uuid
              }}
              fiat={{
                symbol: getFiat(settings).symbol,
                ticker: getFiat(settings).ticker,
                amount: convertToFiat(totalEtherEgress, assetRate).toFixed(2)
              }}
            />
          ) : (
            <Amount
              asset={{
                amount: amount,
                ticker: asset.ticker,
                uuid: asset.uuid
              }}
              baseAssetValue={`+ ${totalEtherEgress} ${baseAsset.ticker}`}
              fiat={{
                symbol: getFiat(settings).symbol,
                ticker: getFiat(settings).ticker,
                amount: convertToFiat(amount, assetRate)
                  .plus(convertToFiat(totalEtherEgress, baseAssetRate))
                  .toFixed(2)
              }}
            />
          )}
        </ColumnWrapper>
      </RowWrapper>
      {ptxFee && (
        <PTXWrapper>
          <PTXHeader>{translateRaw('PROTECTED_TX_RECEIPT_HEADER')}</PTXHeader>
          <RowWrapper>
            <ColumnWrapper>
              <ProtectIconCheck size="sm" />
              {translate('PROTECTED_TX_PRICE')}
            </ColumnWrapper>
            <ColumnWrapper>
              <Amount
                asset={{
                  amount: ptxFee.amount!.toFixed(6),
                  ticker: asset.ticker,
                  uuid: asset.uuid
                }}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(ptxFee.amount!, assetRate).toFixed(2)
                }}
              />
            </ColumnWrapper>
          </RowWrapper>
          <RowWrapper>
            <ColumnWrapper>
              <SIcon type="tx-fee" alt="Fee" />
              {translate('PROTECTED_TX_FEE')}
            </ColumnWrapper>
            <ColumnWrapper>
              <Amount
                asset={{
                  amount: ptxFee.fee!.toFixed(6),
                  ticker: asset.ticker,
                  uuid: asset.uuid
                }}
                fiat={{
                  symbol: getFiat(settings).symbol,
                  ticker: getFiat(settings).ticker,
                  amount: convertToFiat(ptxFee.fee!, assetRate).toFixed(2)
                }}
              />
            </ColumnWrapper>
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
        nonce={nonce}
        signedTransaction={signedTx}
        fiat={fiat}
        baseAssetRate={baseAssetRate}
        assetRate={assetRate}
        rawTransaction={rawTransaction}
        recipient={rawTransaction.to}
        network={network}
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
