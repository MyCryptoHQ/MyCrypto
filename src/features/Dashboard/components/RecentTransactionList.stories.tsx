import { ComponentProps } from 'react';

import { fAccounts, fAssets, fContacts, fContracts, fNetworks, fSettings, fTxHistoryAPI, fTxTypeMetas } from '@fixtures';
import { makeTxReceipt } from '@services';
import { buildTxHistoryEntry } from '@store/helpers';

import { RecentTransactionsListUI } from './RecentTransactionList';

const accountsMap = fAccounts.reduce<Record<string,boolean>>((arr,curr) => ({ ...arr, [curr.uuid]: true }), {})
const apiTx = makeTxReceipt(fTxHistoryAPI, fNetworks[0], fAssets);

const defaultProps: ComponentProps<typeof RecentTransactionsListUI> = {
  settings: fSettings,
  accountTxs: [buildTxHistoryEntry(fNetworks, fContacts, fContracts, fAssets, fAccounts)(fTxTypeMetas, accountsMap)(apiTx)],
  accountsMap: accountsMap,
  isMobile: false,
  txTypeMetas: fTxTypeMetas,
  getAssetRate: () => 0.1
};

export default { title: 'Organisms/RecentTransactionList', component: RecentTransactionsListUI };

export const Default = () => {
  return <RecentTransactionsListUI {...defaultProps} />;
};
