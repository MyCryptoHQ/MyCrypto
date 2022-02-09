import { defaultContacts } from '@database';
import { fAccount, fAccounts, fAssets, fContacts, fDAI, fNetworks, fTxHistoryAPI } from '@fixtures';
import { makeTxReceipt } from '@services';
import { DataStore, ITxType, ITxValue, LSKeys, TAddress } from '@types';
import { values } from '@vendor';

import { migrations } from './persist.config';

describe('Persist Migrations', () => {
  it('3: Updates the MYC_DONATE_ADDRESS in a users persistence layer', () => {
    const migration = migrations['3'];
    const contact = values(defaultContacts)[0];
    const actual = migration({
      [LSKeys.ADDRESS_BOOK]: [{ ...contact, label: 'Deprecated label' }, ...fContacts]
    } as DataStore);
    const expected = { [LSKeys.ADDRESS_BOOK]: [...fContacts, contact] };
    expect(actual).toEqual(expected);
  });

  it('6: Updates the DPath format on accounts', () => {
    const migration = migrations['6'];
    const { path, index, ...account } = fAccount;
    const { path: unusedPath, index: unusedIndex, ...account2 } = fAccounts[0];
    const actual = migration(({
      [LSKeys.ACCOUNTS]: [{ ...account, dPath: "m/44'/60'/0'/0" }, account2]
    } as unknown) as DataStore);
    const expected = { [LSKeys.ACCOUNTS]: [fAccount, account2] };
    expect(actual).toEqual(expected);
  });

  it('6: Handles edge case of unknown DPath', () => {
    const migration = migrations['6'];
    const { path, index, ...account } = fAccounts[0];
    const actual = migration(({
      [LSKeys.ACCOUNTS]: [{ ...account, dPath: "m/44'/4242424242'/0'/0" }]
    } as unknown) as DataStore);
    const expected = {
      [LSKeys.ACCOUNTS]: [
        {
          ...account,
          path: { name: 'Custom DPath', path: "m/44'/4242424242'/0'/<account>" },
          index: 0
        }
      ]
    };
    expect(actual).toEqual(expected);
  });

  it('7: Handles removal of "amount" and "asset" and introduces valueTransfers array', () => {
    const migration = migrations['7'];
    const fTxHistory = {
      ...fTxHistoryAPI,
      erc20Transfers: [
        {
          ...fTxHistoryAPI.erc20Transfers[0],
          from: fTxHistoryAPI.from,
          amount: '0xde0b6b3a7640000',
          contractAddress: fDAI.contractAddress as TAddress
        }
      ],
      txType: ITxType.UNISWAP_V2_DEPOSIT,
      value: '0xde0b6b3a7640000' as ITxValue
    };
    const apiTx = makeTxReceipt(fTxHistory, fNetworks[0], fAssets);
    const actual = migration(({
      [LSKeys.ACCOUNTS]: [
        {
          ...fAccounts[0],
          transactions: [
            {
              ...apiTx,
              amount: apiTx.valueTransfers[0].amount,
              asset: apiTx.valueTransfers[0].asset,
              valueTransfers: undefined
            }
          ]
        }
      ]
    } as unknown) as DataStore);
    const expected = {
      [LSKeys.ACCOUNTS]: [{ ...fAccounts[0], transactions: [{ ...apiTx, valueTransfers: [] }] }]
    };
    expect(actual).toEqual(expected);
  });

  it('7: Does nothing when no transactions are present on account', () => {
    const migration = migrations['7'];
    const input = {
      [LSKeys.ACCOUNTS]: [{ ...fAccounts[0], transactions: [] }]
    };
    const actual = migration((input as unknown) as DataStore);
    expect(actual).toEqual(input)
  })
});
