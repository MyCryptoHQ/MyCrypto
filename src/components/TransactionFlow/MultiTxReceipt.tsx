import { Button } from '@mycrypto/ui';
import styled from 'styled-components';

import { Body, LinkApp, SubHeading, TimeElapsed, Tooltip } from '@components';
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

import { TransactionDetailsDisplay } from './displays';
import './TxReceipt.scss';
import { TxReceiptStatusBadge } from './TxReceiptStatusBadge';
import { TxReceiptTotals } from './TxReceiptTotals';

const Image = styled.img`
  height: 25px;
  margin-right: ${SPACING.SM};
  vertical-align: middle;
`;

interface PendingBtnAction {
  text: string;
  action(cb: any): void;
}

export interface MultiTxReceiptStep {
  title: string;
  icon: string;
}

interface Props {
  transactions: TxParcel[];
  transactionsConfigs: ITxConfig[];
  steps: MultiTxReceiptStep[];
  account: StoreAccount;
  network: Network;
  fiat: Fiat;
  assetRate?: number;
  baseAssetRate?: number;
  pendingButton?: PendingBtnAction;
  customComponent?(): JSX.Element;
}

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
  steps,
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

      {transactions.map((transaction, idx) => {
        const step = steps[idx];
        const { asset, baseAsset, amount } = transactionsConfigs[idx];
        const { gasLimit, data, nonce, value, to } = transaction.txRaw;
        const gasUsed =
          transaction.txReceipt && transaction.txReceipt.gasUsed
            ? transaction.txReceipt.gasUsed.toString()
            : gasLimit;

        const status = transaction.status;
        const timestamp = transaction.minedAt || 0; // @todo
        const localTimestamp = new Date(Math.floor(timestamp * 1000)).toLocaleString();

        const txUrl = buildTxUrl(network.blockExplorer, transaction.txHash!);

        const assetRate = getAssetRate(asset);

        return (
          <div key={idx}>
            <div className="TransactionReceipt-row">
              <div className="TransactionReceipt-row-column" style={{ display: 'flex' }}>
                <Image src={step.icon} alt={step.title} />
                <div>{step.title}</div>
              </div>
              <div className="TransactionReceipt-row-column">
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {translate('TRANSACTIONS_MULTI', {
                    $current: (idx + 1).toString(),
                    $total: transactions.length.toString()
                  })}
                </div>
                {transaction.txHash && (
                  <div>
                    <LinkApp href={txUrl} isExternal={true} color={COLORS.BLUE_SKY}>
                      {truncate(transaction.txHash)}
                    </LinkApp>
                  </div>
                )}
              </div>
            </div>
            <div className="TransactionReceipt-divider" />
            <TxReceiptTotals
              asset={asset}
              assetAmount={amount}
              baseAsset={baseAsset}
              assetRate={assetRate}
              baseAssetRate={baseAssetRate}
              settings={settings}
              rawTransaction={transaction.txRaw}
              gasUsed={gasUsed}
              value={value}
            />

            <div className="TransactionReceipt-details-row">
              <div className="TransactionReceipt-details-row-column">
                <SubHeading color={COLORS.BLUE_GREY} m="0">
                  {translate('TIMESTAMP')}
                  {': '}
                  <Body as="span" fontWeight="normal">
                    {timestamp !== 0 ? (
                      <Tooltip display="inline" tooltip={<TimeElapsed value={timestamp} />}>
                        {localTimestamp}
                      </Tooltip>
                    ) : (
                      translate('PENDING_STATE')
                    )}
                  </Body>
                </SubHeading>
              </div>

              <div className="TransactionReceipt-details-row-column">
                <TxReceiptStatusBadge status={status} />
              </div>
            </div>
            <div className="TransactionReceipt-details">
              <TransactionDetailsDisplay
                baseAsset={baseAsset}
                asset={asset}
                assetAmount={amount}
                confirmations={transaction.txReceipt && transaction.txReceipt.confirmations}
                gasUsed={transaction.txReceipt && transaction.txReceipt.gasUsed}
                data={data}
                sender={account}
                gasLimit={bigNumGasLimitToViewable(bigify(gasLimit))}
                nonce={bigify(nonce).toString()}
                rawTransaction={transaction.txRaw}
                value={value}
                fiat={fiat}
                baseAssetRate={baseAssetRate}
                assetRate={assetRate}
                status={status}
                timestamp={timestamp}
                recipient={to}
                network={network}
              />
            </div>
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
      <LinkApp href={ROUTE_PATHS.DASHBOARD.path}>
        <Button className="TransactionReceipt-back">
          {translate('TRANSACTION_BROADCASTED_BACK_TO_DASHBOARD')}
        </Button>
      </LinkApp>
    </div>
  );
}
