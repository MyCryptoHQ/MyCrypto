import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import {
  ITxStatus,
  IStepComponentProps,
  ITxType,
  ITxConfig,
  TxParcel,
  StoreAccount,
  Network
} from '@types';
import { TimeElapsedCounter, LinkOut } from '@components';
import { ROUTE_PATHS } from '@config';
import { SwapDisplayData } from '@features/SwapAssets/types';
import translate, { translateRaw } from '@translations';
import { truncate } from '@utils';
import { COLORS, SPACING } from '@theme';
import ProtocolTagsList from '@features/DeFiZap/components/ProtocolTagsList';
import { MembershipReceiptBanner } from '@features/PurchaseMembership';

import { SwapFromToDiagram, TransactionDetailsDisplay } from './displays';
import TxIntermediaryDisplay from './displays/TxIntermediaryDisplay';
import zapperLogo from '@assets/images/defizap/zapperLogo.svg';
import './TxReceipt.scss';
import Typography from '../Typography';

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}

interface Props {
  transactions: TxParcel[];
  transactionsConfigs: ITxConfig[];
  account: StoreAccount;
  network: Network;
  pendingButton?: PendingBtnAction;
  swapDisplay?: SwapDisplayData;
}

const SImg = styled('img')`
  height: ${(p: { size: string }) => p.size};
  width: ${(p: { size: string }) => p.size};
`;

const TxLabel = styled(Typography)`
  color: ${COLORS.BLUE_DARK_SLATE};
  text-transform: uppercase;
  margin-bottom: ${SPACING.BASE};
  font-weight: bold;
`;

export default function MultiTxReceipt({
  txType,
  swapDisplay,
  transactions,
  transactionsConfigs,
  zapSelected,
  membershipSelected,
  pendingButton,
  resetFlow,
  account,
  network,
  completeButtonText
}: Omit<IStepComponentProps, 'txConfig' | 'txReceipt'> & Props) {
  const shouldRenderPendingBtn =
    pendingButton && transactions.find((t) => t.status === ITxStatus.PENDING);

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
            toUUID={swapDisplay.toAsset.uuid}
            fromUUID={swapDisplay.fromAsset.uuid}
            fromSymbol={swapDisplay.fromAsset.symbol}
            toSymbol={swapDisplay.toAsset.symbol}
            fromAmount={swapDisplay.fromAmount.toString()}
            toAmount={swapDisplay.toAmount.toString()}
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
              <SImg src={zapperLogo} size="24px" />
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

      {txType === ITxType.PURCHASE_MEMBERSHIP && membershipSelected && (
        <div className="TransactionReceipt-row">
          <MembershipReceiptBanner membershipSelected={membershipSelected} />
        </div>
      )}

      {txType !== ITxType.DEFIZAP && <div className="TransactionReceipt-divider" />}
      {transactions.map((transaction, idx) => {
        const { asset, baseAsset } = transactionsConfigs[idx];
        const { gasPrice, gasLimit, data, nonce } = transaction.txRaw;

        const timestamp = transaction.minedAt || 0; // @TODO
        const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();

        const txUrl =
          network && network.blockExplorer
            ? network.blockExplorer.txUrl(transaction.txHash as string)
            : '';

        return (
          <div key={idx} className="TransactionReceipt-details">
            <TxLabel as="div">{transaction.label}</TxLabel>
            <div className="TransactionReceipt-details-row">
              <div className="TransactionReceipt-details-row-column">
                {translate('TRANSACTION_ID')}:
              </div>
              <div className="TransactionReceipt-details-row-column">
                <LinkOut text={transaction.txHash as string} truncate={truncate} link={txUrl} />
              </div>
            </div>
            <div className="TransactionReceipt-details-row">
              <div className="TransactionReceipt-details-row-column">
                {translate('TRANSACTION_STATUS')}:
              </div>
              <div className="TransactionReceipt-details-row-column">
                {translate(transaction.status)}
              </div>
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
              sender={account}
              gasLimit={gasLimit}
              gasPrice={gasPrice}
              nonce={nonce}
              rawTransaction={transaction.txRaw}
            />
          </div>
        );
      })}
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
}
