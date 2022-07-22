import { ComponentProps } from 'react';

import {
  fAccounts,
  fAssets,
  fContacts,
  fContracts,
  fNetworks,
  fSettings,
  fTxHistoryAPI,
  fTxTypeMetas
} from '@fixtures';
import { makeTxReceipt } from '@services';
import { buildTxHistoryEntry } from '@store/helpers';
import { ITxType, ITxValue, TAddress } from '@types';

import { RecentTransactionsListUI } from './RecentTransactionList';

const accountsMap = fAccounts.reduce<Record<string, boolean>>(
  (arr, curr) => ({ ...arr, [curr.uuid]: true }),
  {}
);
const newERC20Transfer = {
  ...fTxHistoryAPI.erc20Transfers[0],
  from: fTxHistoryAPI.from,
  contractAddress: '0x0000000000000000000000000000000000000001' as TAddress,
  amount: '0xde0b6b3a7640000'
};
const fTxHistory = {
  ...fTxHistoryAPI,
  txType: ITxType.STANDARD,
  erc20Transfers: [newERC20Transfer],
  value: '0xde0b6b3a7640000' as ITxValue
};
const apiTx = makeTxReceipt(fTxHistory, fNetworks[0], fAssets);

const defaultProps: ComponentProps<typeof RecentTransactionsListUI> = {
  settings: fSettings,
  accountTxs: [
    buildTxHistoryEntry(
      fNetworks,
      fContacts,
      fContracts,
      fAssets,
      fAccounts
    )(
      fTxTypeMetas,
      accountsMap
    )(apiTx)
  ],
  accountsMap: accountsMap,
  isMobile: false,
  txTypeMetas: fTxTypeMetas,
  getAssetRate: () => 0.1
};

export default { title: 'Organisms/RecentTransactionList', component: RecentTransactionsListUI };

export const Default = () => {
  return <RecentTransactionsListUI {...defaultProps} />;
};
