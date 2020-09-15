import React from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { waitFor } from 'test-utils';

import { fAccounts, fAssets, fTxReceipt } from '@fixtures';
import { IAccount, LSKeys, TUuid } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import { SettingsContext } from '../Settings';
import useAccounts from './useAccounts';

jest.mock('@mycrypto/eth-scan', () => {
  return {
    getTokensBalance: jest.fn().mockImplementation(() =>
      Promise.resolve({
        '0xad6d458402f60fd3bd25163575031acdce07538d': {
          _hex: '0x0e22e84c2c724c00'
        }
      })
    )
  };
});

const renderUseAccounts = ({ accounts = [] as IAccount[], createActions = jest.fn() } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ accounts, createActions } as any) as IDataContext}>
      <SettingsContext.Provider
        value={{ addAccountToFavorites: jest.fn, addMultipleAccountsToFavorites: jest.fn() } as any}
      >
        {' '}
        {children}
      </SettingsContext.Provider>
    </DataContext.Provider>
  );
  return renderHook(() => useAccounts(), { wrapper });
};

describe('useAccounts', () => {
  it('uses get addressbook from DataContext', () => {
    const { result } = renderUseAccounts({ accounts: fAccounts });
    expect(result.current.accounts).toEqual(fAccounts);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseAccounts({ createActions });
    expect(createActions).toHaveBeenCalledWith(LSKeys.ACCOUNTS);
  });

  it('createAccountWithID() calls model.createWithId', () => {
    const mockCreate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: [],
      createActions: jest.fn(() => ({ createWithID: mockCreate }))
    });
    result.current.createAccountWithID('uuid' as TUuid, fAccounts[0]);
    expect(mockCreate).toHaveBeenCalledWith({ ...fAccounts[0], uuid: 'uuid' }, 'uuid');
  });

  it('createMultipleAccountsWithIDs() calls model.updateAll with multiple accounts', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: [],
      createActions: jest.fn(() => ({ updateAll: mockUpdate }))
    });
    result.current.createMultipleAccountsWithIDs(fAccounts);
    expect(mockUpdate).toHaveBeenCalledWith(fAccounts);
  });

  it('deleteAccount() calls model.destroy', () => {
    const mockDestroy = jest.fn();
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn(() => ({ destroy: mockDestroy }))
    });
    result.current.deleteAccount(fAccounts[0]);
    expect(mockDestroy).toHaveBeenCalledWith(fAccounts[0]);
  });

  it('updateAccount() calls model.update', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.updateAccount(fAccounts[0].uuid, fAccounts[0]);
    expect(mockUpdate).toHaveBeenCalledWith(fAccounts[0].uuid, fAccounts[0]);
  });

  it('addTxToAccount() updates account with tx', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.addTxToAccount(fAccounts[0], fTxReceipt);
    expect(mockUpdate).toHaveBeenCalledWith(fAccounts[0].uuid, {
      ...fAccounts[0],
      transactions: [fTxReceipt]
    });
  });

  it('removeTxFromAccount() updates account to remove tx', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: [{ ...fAccounts[0], transactions: [fTxReceipt] }],
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.removeTxFromAccount(fAccounts[0], fTxReceipt);
    expect(mockUpdate).toBeCalledWith(fAccounts[0].uuid, {
      ...fAccounts[0],
      transactions: []
    });
  });

  it('getAccountByAddressAndNetworkName() updates account with tx', () => {
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn()
    });
    const account = result.current.getAccountByAddressAndNetworkName(
      fAccounts[0].address,
      fAccounts[0].networkId
    );
    expect(account).toBe(fAccounts[0]);
  });

  it('updateAccountAssets()', async () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.updateAccountAssets(fAccounts[1], fAssets);
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(fAccounts[1].uuid, {
        ...fAccounts[1],
        assets: [
          expect.objectContaining({
            uuid: fAssets[10].uuid,
            balance: '1018631879600000000'
          }),
          ...fAccounts[1].assets
        ]
      })
    );
  });

  it('updateAllAccountsAssets()', async () => {
    const mockUpdate = jest.fn();
    const accounts = [fAccounts[1], { ...fAccounts[2], assets: [] }];
    const { result } = renderUseAccounts({
      accounts,
      createActions: jest.fn(() => ({ updateAll: mockUpdate }))
    });
    result.current.updateAllAccountsAssets(accounts, fAssets);
    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(
        accounts.map((a) => ({
          ...a,
          assets: [
            expect.objectContaining({
              uuid: fAssets[10].uuid,
              balance: '1018631879600000000'
            }),
            ...a.assets
          ]
        }))
      )
    );
  });

  it('updateAccounts() calls updateAll with merged list', async () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn(() => ({ updateAll: mockUpdate }))
    });
    result.current.updateAccounts(fAccounts.slice(0, 3));
    await waitFor(() => expect(mockUpdate).toHaveBeenCalledWith(fAccounts));
  });

  it('toggleAccountPrivacy() updates account with isPrivate', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseAccounts({
      accounts: fAccounts,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.toggleAccountPrivacy(fAccounts[0].uuid);
    expect(mockUpdate).toHaveBeenCalledWith(fAccounts[0].uuid, {
      ...fAccounts[0],
      isPrivate: true
    });
  });
});
