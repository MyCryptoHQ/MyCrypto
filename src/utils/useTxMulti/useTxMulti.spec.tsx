import React from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import { waitFor } from 'test-utils';

import { fAccount, fAccounts, fAssets, fNetwork, fNetworks, fSettings } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services';
import { ITxData, ITxHash, ITxObject, ITxStatus, ITxToAddress, ITxType, ITxValue } from '@types';
import { isEmpty } from '@vendor';

import { useTxMulti } from './useTxMulti';

const createTxRaw = (idx: number): Partial<ITxObject> => ({
  to: ('address' + idx) as ITxToAddress,
  value: 'any' as ITxValue,
  data: 'empty' as ITxData
});

jest.mock('ethers/providers', () => {
  return {
    // Since there are no nodes in our StoreContext,
    // ethers will default to FallbackProvider
    FallbackProvider: () => ({
      sendTransaction: jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve({
            hash: '0x1',
            value: '0x',
            gasLimit: '0x',
            gasPrice: '0x',
            nonce: '0x',
            to: '0x',
            from: '0x',
            data: '0x'
          })
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            hash: '0x2',
            value: '0x',
            gasLimit: '0x',
            gasPrice: '0x',
            nonce: '0x',
            to: '0x',
            from: '0x',
            data: '0x'
          })
        ),
      waitForTransaction: jest.fn().mockImplementation(() => Promise.resolve({})),
      getBlock: jest.fn().mockImplementation(() => Promise.resolve({}))
    }),
    InfuraProvider: () => ({})
  };
});

const renderUseTxMulti = ({ createActions = jest.fn() } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider
      value={
        ({
          accounts: fAccounts,
          networks: fNetworks,
          assets: fAssets,
          settings: fSettings,
          createActions
        } as any) as IDataContext
      }
    >
      <StoreContext.Provider value={{ accounts: fAccounts } as any}>
        {' '}
        {children}
      </StoreContext.Provider>
    </DataContext.Provider>
  );
  return renderHook(() => useTxMulti(), { wrapper });
};

describe('useTxMulti', () => {
  const rawTxs = [createTxRaw(1), createTxRaw(2)];

  it('can initialize the hook', async () => {
    const { result: r } = renderUseTxMulti();

    act(() => {
      r.current.init(rawTxs, fAccount, fNetwork);
    });

    const state = r.current.state;
    expect(state._isInitialized).toBeTruthy();
    expect(state._currentTxIdx).toEqual(0);
    expect(state.account).toEqual(fAccount);
    expect(state.network).toEqual(fNetwork);
    expect(state.isSubmitting).toBeFalsy();
    // Check that the transactions are correctly formatted.
    expect(state.transactions).toHaveLength(rawTxs.length);
    expect(state.transactions).toContainEqual({
      txRaw: { to: 'address1', value: 'any', data: 'empty' },
      _uuid: 'cc85a4c4-8c65-54a7-b286-bac7096b012a',
      status: 'PREPARING'
    });
  });

  it('can initialize the after an async call', async () => {
    const { result: r } = renderUseTxMulti();

    await act(async () => {
      await r.current.initWith(() => Promise.resolve(rawTxs), fAccount, fNetwork);
    });

    const state = r.current.state;
    expect(state._isInitialized).toBeTruthy();
    expect(state._currentTxIdx).toEqual(0);
    expect(state.account).toEqual(fAccount);
    expect(state.network).toEqual(fNetwork);
    expect(state.isSubmitting).toBeFalsy();
    // Check that the transactions are correctly formatted.
    expect(state.transactions).toHaveLength(rawTxs.length);
    expect(state.transactions).toContainEqual({
      txRaw: { to: 'address1', value: 'any', data: 'empty' },
      _uuid: 'cc85a4c4-8c65-54a7-b286-bac7096b012a',
      status: 'PREPARING'
    });
  });

  it('sets state.error if init fails', async () => {
    const { result: r } = renderUseTxMulti();
    const error = new Error('Init failed');
    await act(async () => {
      await r.current.initWith(() => Promise.reject(error), fAccount, fNetwork);
    });
    const state = r.current.state;
    expect(state.error).toEqual(error);
    expect(state.isSubmitting).toBeFalsy();
    expect(state.canYield).toBeFalsy();
  });

  it('can reset the state', async () => {
    const { result: r } = renderUseTxMulti();
    await act(async () => {
      await r.current.initWith(() => Promise.resolve(rawTxs), fAccount, fNetwork);
    });
    let state = r.current.state;
    expect(state.transactions).toContainEqual({
      txRaw: { to: 'address1', value: 'any', data: 'empty' },
      _uuid: 'cc85a4c4-8c65-54a7-b286-bac7096b012a',
      status: 'PREPARING'
    });
    await act(async () => {
      await r.current.reset();
    });
    state = r.current.state;
    expect(isEmpty(state.transactions)).toBeTruthy();
  });

  it('adds the txs to the tx history', async () => {
    const mockUpdate = jest.fn();
    const { result: r } = renderUseTxMulti({
      createActions: jest.fn().mockImplementation(() => ({
        update: mockUpdate
      }))
    });

    const rawTx = {
      to: 'address' as ITxToAddress,
      value: '0x' as ITxValue,
      data: '0x' as ITxData,
      chainId: 3
    };

    await act(async () => {
      await r.current.initWith(
        () =>
          Promise.resolve([
            { ...rawTx, value: '0x1' as ITxValue, type: ITxType.APPROVAL },
            { ...rawTx, value: '0x2' as ITxValue, type: ITxType.PURCHASE_MEMBERSHIP }
          ]),
        fAccount,
        fNetwork
      );
      await r.current.prepareTx(r.current.currentTx.txRaw);
      await r.current.sendTx('0x' as ITxHash);
    });

    await waitFor(() => expect(r.current.currentTx.txRaw.value).toBe('0x2'));

    await act(async () => {
      await r.current.prepareTx(r.current.currentTx.txRaw);
      await r.current.sendTx('0x' as ITxHash);
    });

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(fAccount.uuid, {
        ...fAccount,
        transactions: expect.arrayContaining([
          expect.objectContaining({
            amount: '0.0',
            asset: fAssets[1],
            baseAsset: fAssets[1],
            hash: '0x1',
            txType: ITxType.APPROVAL,
            status: ITxStatus.PENDING
          })
        ])
      })
    );

    await waitFor(() =>
      expect(mockUpdate).toHaveBeenCalledWith(fAccount.uuid, {
        ...fAccount,
        transactions: expect.arrayContaining([
          expect.objectContaining({
            amount: '0.0',
            asset: fAssets[1],
            baseAsset: fAssets[1],
            hash: '0x2',
            txType: ITxType.PURCHASE_MEMBERSHIP,
            status: ITxStatus.PENDING
          })
        ])
      })
    );
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  });
});
