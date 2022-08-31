import { FC } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import {
  actionWithPayload,
  mockAppState,
  mockUseDispatch,
  ProvidersWrapper,
  waitFor
} from 'test-utils';

import { fAccounts, fNetworks, fTxReceipt } from '@fixtures';
import { IAccount } from '@types';

import useAccounts from './useAccounts';

jest.mock('../Settings', () => {
  return {
    useSettings: () => ({})
  };
});

jest.mock('@mycrypto/eth-scan', () => {
  return {
    getTokensBalance: jest.fn().mockImplementation(() =>
      Promise.resolve({
        '0xad6d458402f60fd3bd25163575031acdce07538d': BigInt('0x0e22e84c2c724c00')
      })
    )
  };
});

const renderUseAccounts = ({ accounts = [] as IAccount[] } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ accounts, networks: fNetworks })}>
      {children}
    </ProvidersWrapper>
  );
  return renderHook(() => useAccounts(), { wrapper });
};

describe('useAccounts', () => {
  it('uses get addressbook from store', () => {
    const { result } = renderUseAccounts({ accounts: fAccounts });
    expect(result.current.accounts).toEqual(fAccounts);
  });

  it('deleteAccount() calls destroy', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAccounts({ accounts: fAccounts });
    result.current.deleteAccount(fAccounts[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAccounts[0].uuid));
  });

  it('updateAccount() calls update', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAccounts({ accounts: fAccounts });
    result.current.updateAccount(fAccounts[0].uuid, fAccounts[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAccounts[0]));
  });

  it('addTxToAccount() updates account with tx', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAccounts({ accounts: fAccounts });
    result.current.addTxToAccount(fAccounts[0], fTxReceipt);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        account: fAccounts[0],
        tx: fTxReceipt
      })
    );
  });

  it('removeTxFromAccount() updates account to remove tx', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAccounts({
      accounts: [{ ...fAccounts[0], transactions: [fTxReceipt] }]
    });
    result.current.removeTxFromAccount(fAccounts[0], fTxReceipt);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...fAccounts[0],
        transactions: []
      })
    );
  });

  it('getAccountByAddressAndNetworkName() updates account with tx', () => {
    const { result } = renderUseAccounts({
      accounts: fAccounts
    });
    const account = result.current.getAccountByAddressAndNetworkName(
      fAccounts[0].address,
      fAccounts[0].networkId
    );
    expect(account).toStrictEqual(fAccounts[0]);
  });

  it('updateAccounts() calls updateAll with merged list', async () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAccounts({ accounts: fAccounts });
    result.current.updateAccounts(fAccounts.slice(0, 3));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fAccounts)));
  });

  it('toggleAccountPrivacy() updates account with isPrivate', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseAccounts({ accounts: fAccounts });
    result.current.toggleAccountPrivacy(fAccounts[0].uuid);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        ...fAccounts[0],
        isPrivate: true
      })
    );
  });
});
