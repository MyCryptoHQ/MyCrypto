import React from 'react';

import { Button } from '@mycrypto/ui';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { LinkOut, TimeElapsedCounter } from '@components';
import { ROUTE_PATHS } from '@config';
import { useRates, useSettings } from '@services';
import { COLORS, SPACING } from '@theme';
import translate from '@translations';
import {
  Fiat,
  IStepComponentProps,
  ITxConfig,
  ITxStatus,
  Network,
  StoreAccount,
  TxParcel
} from '@types';
import { bigify, bigNumGasLimitToViewable, buildTxUrl, truncate } from '@utils';

import Typography from '../Typography';
import { TransactionDetailsDisplay } from './displays';
import './TxReceipt.scss';
import { TxReceiptStatusBadge } from './TxReceiptStatusBadge';
import { TxReceiptTotals } from './TxReceiptTotals';

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}

interface Props {
  transactions: TxParcel[];
  transactionsConfigs: ITxConfig[];
  account: StoreAccount;
  network: Network;
  fiat: Fiat;
  assetRate?: number;
  baseAssetRate?: number;
  pendingButton?: PendingBtnAction;
  customComponent?(): JSX.Element;
}

const TxLabel = styled(Typography)`
  color: ${COLORS.BLUE_DARK_SLATE};
  text-transform: uppercase;
  margin-bottom: ${SPACING.BASE};
  font-weight: bold;
`;

export default function MultiTxReceipt({
  transactions,
  transactionsConfigs,
  pendingButton,
  resetFlow,
  account,
  network,
  completeButtonText,
  fiat,
  baseAssetRate,
  customComponent
}: Omit<IStepComponentProps, 'txConfig' | 'txReceipt'> & Props) {
  const { settings } = useSettings();
  const { getAssetRate } = useRates();

  const hasPendingTx = transactions.some((t) => t.status === ITxStatus.PENDING);
  const shouldRenderPendingBtn = pendingButton && hasPendingTx;

  return (
    <div className="TransactionReceipt">
      {hasPendingTx && (
        <div className="TransactionReceipt-row">
          <div className="TransactionReceipt-row-desc">
            {translate('TRANSACTION_BROADCASTED_DESC')}
          </div>
        </div>
      )}
      {/* CUSTOM FLOW CONTENT */}

      {customComponent && customComponent()}

      {customComponent && <div className="TransactionReceipt-divider" />}
      {transactions.map((transaction, idx) => {
        const { asset, baseAsset } = transactionsConfigs[idx];
        const { gasPrice, gasLimit, data, nonce, value } = transaction.txRaw;
        const gasUsed =
          transaction.txReceipt && transaction.txReceipt.gasUsed
            ? transaction.txReceipt.gasUsed.toString()
            : gasLimit;

        const timestamp = transaction.minedAt || 0; // @todo
        const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();

        const txUrl = buildTxUrl(network.blockExplorer, transaction.txHash!);

        return (
          <div key={idx} className="TransactionReceipt-details">
            <TxLabel as="div">{transaction.label}</TxLabel>
            <TxReceiptTotals
              asset={asset}
              assetAmount={'0'}
              baseAsset={baseAsset}
              assetRate={getAssetRate(asset)}
              baseAssetRate={baseAssetRate}
              settings={settings}
              gasPrice={gasPrice}
              gasUsed={gasUsed}
              value={value}
            />
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
                <TxReceiptStatusBadge status={transaction.status} />
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
              gasLimit={bigNumGasLimitToViewable(bigify(gasLimit))}
              gasPrice={bigify(gasPrice).toString()}
              nonce={nonce}
              rawTransaction={transaction.txRaw}
              fiat={fiat}
              baseAssetRate={baseAssetRate}
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
