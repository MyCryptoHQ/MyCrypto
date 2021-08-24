import { FC } from 'react';

import { act, renderHook } from '@testing-library/react-hooks';
import {
  actionWithPayload,
  mockAppState,
  mockUseDispatch,
  ProvidersWrapper,
  waitFor
} from 'test-utils';

import { fAccount, fAccounts, fAssets, fNetwork, fNetworks, fSettings } from '@fixtures';
import { ITxData, ITxHash, ITxNonce, ITxStatus, ITxToAddress, ITxType, ITxValue } from '@types';
import { isEmpty } from '@vendor';

import { useTxMulti } from './useTxMulti';

jest.mock('@vendor', () => ({
  ...jest.requireActual('@vendor'),
  FallbackProvider: jest.fn().mockImplementation(() => ({
    sendTransaction: jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          hash: '0x1',
          value: '0x00',
          gasLimit: '0x7d3c',
          gasPrice: '0x012a05f200',
          nonce: '0x13',
          to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          data: '0x'
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          hash: '0x2',
          value: '0x00',
          gasLimit: '0x7d3c',
          gasPrice: '0x012a05f200',
          nonce: '0x13',
          to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          from: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
          data: '0x'
        })
      ),
    waitForTransaction: jest.fn().mockImplementation(() => Promise.resolve({ status: 1 })),
    getBlock: jest.fn().mockImplementation(() => Promise.resolve({})),
    call: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve('0x000000000000000000000000000000000000000000000000016345785d8a0000')
      ),
    estimateGas: jest.fn().mockResolvedValue(21000),
    getTransactionCount: jest.fn().mockResolvedValue(1)
  }))
}));

const renderUseTxMulti = () => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper
      initialState={mockAppState({
        accounts: fAccounts,
        networks: fNetworks,
        assets: fAssets,
        settings: fSettings
      })}
    >
      {children}
    </ProvidersWrapper>
  );
  return renderHook(() => useTxMulti(), { wrapper });
};

describe('useTxMulti', () => {
  const tx = {
    to: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520' as ITxToAddress,
    value: '0x00' as ITxValue,
    data: '0x00' as ITxData,
    nonce: '0x01' as ITxNonce
  };
  const rawTxs = [tx, { ...tx, nonce: '0x02' as ITxNonce }];

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
      txRaw: tx,
      _uuid: '10a04f9c-250e-5054-aeb2-fd729b4088d0',
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
      txRaw: tx,
      _uuid: '10a04f9c-250e-5054-aeb2-fd729b4088d0',
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
      txRaw: tx,
      _uuid: '10a04f9c-250e-5054-aeb2-fd729b4088d0',
      status: 'PREPARING'
    });
    await act(async () => {
      await r.current.reset();
    });
    state = r.current.state;
    expect(isEmpty(state.transactions)).toBeTruthy();
  });

  it('adds the txs to the tx history', async () => {
    const mockDispatch = mockUseDispatch();
    const { result: r } = renderUseTxMulti();

    const rawTx = {
      ...tx,
      gasPrice: '0xee6b2800',
      nonce: '0x13' as ITxNonce,
      from: tx.to,
      chainId: 3
    };

    await act(async () => {
      await r.current.initWith(
        () =>
          Promise.resolve([
            {
              ...rawTx,
              value: '0x01' as ITxValue,
              data: '0x095ea7b30000000000000000000000006ca105d2af7095b1bceeb6a2113d168dddcd57cf0000000000000000000000000000000000000000000000008ac7230489e80000' as ITxData,
              txType: ITxType.APPROVAL
            },
            { ...rawTx, value: '0x02' as ITxValue, txType: ITxType.PURCHASE_MEMBERSHIP }
          ]),
        fAccount,
        fNetwork
      );
      await r.current.prepareTx(r.current.currentTx.txRaw);
      await r.current.sendTx('0x' as ITxHash);
    });

    await waitFor(() => expect(r.current.currentTx.txRaw.value).toBe('0x02'));

    await act(async () => {
      await r.current.prepareTx(r.current.currentTx.txRaw);
      await r.current.sendTx('0x' as ITxHash);
    });

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        actionWithPayload(
          expect.objectContaining({
            tx: expect.objectContaining({
              asset: fAssets[1],
              baseAsset: fAssets[1],
              hash: '0x1',
              txType: ITxType.APPROVAL,
              status: ITxStatus.PENDING
            })
          })
        )
      )
    );

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        actionWithPayload(
          expect.objectContaining({
            tx: expect.objectContaining({
              asset: fAssets[1],
              baseAsset: fAssets[1],
              hash: '0x2',
              txType: ITxType.PURCHASE_MEMBERSHIP,
              status: ITxStatus.PENDING
            })
          })
        )
      )
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('filters out unnecessary approvals', async () => {
    const mockDispatch = mockUseDispatch();
    const { result: r } = renderUseTxMulti();

    const rawTx = {
      to: 'address' as ITxToAddress,
      value: '0x' as ITxValue,
      data: '0x' as ITxData,
      from: fAccount.address,
      chainId: 3
    };

    await act(async () => {
      await r.current.initWith(
        () =>
          Promise.resolve([
            {
              ...rawTx,
              value: '0x1' as ITxValue,
              data: '0x095ea7b30000000000000000000000006ca105d2af7095b1bceeb6a2113d168dddcd57cf000000000000000000000000000000000000000000000000016345785d8a0000' as ITxData,
              txType: ITxType.APPROVAL
            },
            { ...rawTx, value: '0x2' as ITxValue, txType: ITxType.PURCHASE_MEMBERSHIP }
          ]),
        fAccount,
        fNetwork
      );
    });

    await waitFor(() =>
      expect(r.current.currentTx).toStrictEqual(
        expect.objectContaining({
          txRaw: expect.objectContaining({
            value: '0x2'
          }),
          txType: ITxType.PURCHASE_MEMBERSHIP
        })
      )
    );
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });

  it('doesnt filter out necessary approvals', async () => {
    const mockDispatch = jest.fn();
    const { result: r } = renderUseTxMulti();

    const rawTx = {
      to: 'address' as ITxToAddress,
      value: '0x' as ITxValue,
      data: '0x' as ITxData,
      from: fAccount.address,
      chainId: 3
    };

    await act(async () => {
      await r.current.initWith(
        () =>
          Promise.resolve([
            {
              ...rawTx,
              value: '0x1' as ITxValue,
              data: '0x095ea7b30000000000000000000000006ca105d2af7095b1bceeb6a2113d168dddcd57cf0000000000000000000000000000000000000000000000008ac7230489e80000' as ITxData,
              txType: ITxType.APPROVAL
            },
            { ...rawTx, value: '0x2' as ITxValue, txType: ITxType.PURCHASE_MEMBERSHIP }
          ]),
        fAccount,
        fNetwork
      );
    });

    await waitFor(() =>
      expect(r.current.currentTx).toStrictEqual(
        expect.objectContaining({
          txRaw: expect.objectContaining({
            value: '0x1'
          }),
          txType: ITxType.APPROVAL
        })
      )
    );
    expect(mockDispatch).toHaveBeenCalledTimes(0);
  });
});
