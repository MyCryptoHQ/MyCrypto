import React, { useContext } from 'react';
import styled from 'styled-components';

import {
  Amount,
  DashboardPanel,
  AssetIcon,
  Account,
  FixedSizeCollapsibleTable,
  EditableAccountLabel,
  RouterLink
} from '@components';
import { convertToFiat, isSameAddress } from '@utils';
import { ITxStatus, StoreAccount, Asset } from '@types';
import { useRates, SettingsContext, useTxHistory, ITxHistoryEntry, useContacts } from '@services';
import { translateRaw } from '@translations';
import { txIsFailed, txIsPending, txIsSuccessful } from '@services/Store/helpers';
import { COLORS } from '@theme';
import { getFiat } from '@config/fiats';
import { ROUTE_PATHS } from '@config';

import NoTransactions from './NoTransactions';
import TransactionLabel from './TransactionLabel';
import { ITxHistoryType } from '../types';
import './RecentTransactionList.scss';

import moreIcon from '@assets/images/icn-more.svg';
import transfer from '@assets/images/transactions/transfer.svg';
import inbound from '@assets/images/transactions/inbound.svg';
import outbound from '@assets/images/transactions/outbound.svg';
import approval from '@assets/images/transactions/approval.svg';
import contractInteract from '@assets/images/transactions/contract-interact.svg';
import contractDeploy from '@assets/images/transactions/contract-deploy.svg';
import defizap from '@assets/images/transactions/defizap.svg';
import membershipPurchase from '@assets/images/transactions/membership-purchase.svg';
import swap from '@assets/images/transactions/swap.svg';

interface Props {
  className?: string;
  accountsList: StoreAccount[];
}

interface ITxTypeConfigObj {
  icon: any;
  label(asset: Asset): string;
}

type ITxTypeConfig = {
  [txType in ITxHistoryType]: ITxTypeConfigObj;
};

const TxTypeConfig: ITxTypeConfig = {
  [ITxHistoryType.INBOUND]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_RECEIVED', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: inbound
  },
  [ITxHistoryType.OUTBOUND]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_SENT', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: outbound
  },
  [ITxHistoryType.TRANSFER]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_TRANSFERRED', {
        $ticker: asset.ticker || translateRaw('UNKNOWN')
      }),
    icon: transfer
  },
  [ITxHistoryType.REP_TOKEN_MIGRATION]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_REP_MIGRATION'),
    icon: transfer
  },
  [ITxHistoryType.DEFIZAP]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_DEFIZAP_ADD'),
    icon: defizap
  },
  [ITxHistoryType.PURCHASE_MEMBERSHIP]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_MEMBERSHIP_PURCHASED'),
    icon: membershipPurchase
  },
  [ITxHistoryType.SWAP]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_SWAP'),
    icon: swap
  },
  [ITxHistoryType.APPROVAL]: {
    label: (asset: Asset) =>
      translateRaw('RECENT_TX_LIST_LABEL_APPROVAL', { $ticker: asset.ticker }),
    icon: approval
  },
  [ITxHistoryType.CONTRACT_INTERACT]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_INTERACT'),
    icon: contractInteract
  },
  [ITxHistoryType.DEPLOY_CONTRACT]: {
    label: (_: Asset) => translateRaw('RECENT_TX_LIST_LABEL_CONTRACT_DEPLOY'),
    icon: contractDeploy
  }
};

const SAssetIcon = styled(AssetIcon)`
  filter: grayscale(1); /* W3C */
`;

const CCircle = styled('div')`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.GREY_LIGHTEST};
  border: 3px solid #ffffff;
  bottom: -9px;
  right: -9px;
  border-radius: 50%;
  z-index: 2;
  height: 24px;
  width: 24px;
`;
const SCombinedCircle = (asset: Asset) => {
  return (
    <CCircle>
      <SAssetIcon uuid={asset.uuid} size={'16px'} />
    </CCircle>
  );
};

const makeTxIcon = (type: ITxHistoryType, asset: Asset) => {
  const greyscaleIcon = asset && <>{SCombinedCircle(asset)}</>;
  const baseIcon = (
    <div className="TransactionLabel-image">
      <img
        src={TxTypeConfig[type] ? TxTypeConfig[type].icon : transfer}
        width="56px"
        height="56px"
      />
      {greyscaleIcon}
    </div>
  );
  return baseIcon;
};

export default function RecentTransactionList({ accountsList, className = '' }: Props) {
  const { getAssetRate } = useRates();
  const { settings } = useContext(SettingsContext);
  const { txHistory } = useTxHistory();
  const { createContact, updateContact } = useContacts();

  const accountTxs = txHistory.filter((tx) =>
    accountsList.some((a) => isSameAddress(a.address, tx.to) || isSameAddress(a.address, tx.from))
  );

  const pending = accountTxs.filter(txIsPending);
  const completed = accountTxs.filter(txIsSuccessful);
  const failed = accountTxs.filter(txIsFailed);

  const createEntries = (_: string, collection: ITxHistoryEntry[]) =>
    collection.map(
      ({
        timestamp,
        hash,
        status,
        from,
        to,
        receiverAddress,
        amount,
        asset,
        fromAddressBookEntry,
        toAddressBookEntry,
        networkId,
        txType
      }) => {
        const editableFromLabel = EditableAccountLabel({
          addressBookEntry: fromAddressBookEntry,
          address: from,
          networkId,
          createContact,
          updateContact
        });
        const editableToLabel = EditableAccountLabel({
          addressBookEntry: toAddressBookEntry,
          address: receiverAddress || to,
          networkId,
          createContact,
          updateContact
        });

        return [
          <TransactionLabel
            key={0}
            image={makeTxIcon(txType, asset)}
            label={TxTypeConfig[txType].label(asset)}
            stage={status}
            date={timestamp}
          />,
          <Account key={1} title={editableFromLabel} truncate={true} address={from} />,
          to && (
            <Account
              key={2}
              title={editableToLabel}
              truncate={true}
              address={receiverAddress || to}
            />
          ),
          <Amount
            key={3}
            assetValue={`${parseFloat(amount).toFixed(4)} ${asset.ticker}`}
            fiat={{
              symbol: getFiat(settings).symbol,
              ticker: getFiat(settings).ticker,
              amount: convertToFiat(parseFloat(amount), getAssetRate(asset)).toFixed(2)
            }}
          />,
          <RouterLink
            key={4}
            to={`${ROUTE_PATHS.TX_STATUS.path}/?hash=${hash}&network=${networkId}`}
          >
            <img src={moreIcon} alt="View more information about this transaction" />
          </RouterLink>
        ];
      }
    );

  const groups = [
    {
      title: 'Pending',
      entries: createEntries(ITxStatus.PENDING, pending)
    },
    {
      title: 'Completed',
      entries: createEntries(ITxStatus.SUCCESS, completed)
    },
    {
      title: 'Failed',
      entries: createEntries(ITxStatus.FAILED, failed)
    }
  ];
  const filteredGroups = groups.filter((group) => group.entries.length !== 0);

  const recentTransactionsTable = {
    head: [
      translateRaw('RECENT_TRANSACTIONS_DATE') || 'Date',
      translateRaw('RECENT_TRANSACTIONS_FROM_ADDRESS'),
      translateRaw('RECENT_TRANSACTIONS_TO_ADDRESS'),
      translateRaw('RECENT_TRANSACTIONS_TO_AMOUNT'),
      ''
    ],
    body: [],
    groups: filteredGroups,
    config: {
      primaryColumn: translateRaw('RECENT_TRANSACTIONS_DATE'),
      sortableColumn: translateRaw('RECENT_TRANSACTIONS_DATE'),
      sortFunction: () => (a: any, b: any) => b.props.date - a.props.date,
      hiddenHeadings: [translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')],
      iconColumns: [translateRaw('RECENT_TRANSACTIONS_VIEW_MORE')]
    }
  };
  return (
    <DashboardPanel
      heading="Recent Transactions"
      //headingRight="Export"
      //actionLink="/dashboard/recent-transactions"
      className={`RecentTransactionsList ${className}`}
    >
      {filteredGroups.length >= 1 ? (
        <FixedSizeCollapsibleTable breakpoint={1000} {...recentTransactionsTable} />
      ) : (
        NoTransactions()
      )}
    </DashboardPanel>
  );
}
