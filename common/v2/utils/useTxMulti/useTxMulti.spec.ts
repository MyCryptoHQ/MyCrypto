import { renderHook, act } from '@testing-library/react-hooks';
import isEmpty from 'ramda/src/isEmpty';
import { fAccount, fNetwork } from '@fixtures';

import { useTxMulti } from './useTxMulti';
import { ITxObject, TAddress } from 'v2/types';

const createTxRaw = (idx: number): Partial<ITxObject> => ({
  to: ('address' + idx) as TAddress,
  value: 'any',
  data: 'empty'
});

describe('useTxMulti', () => {
  const rawTxs = [createTxRaw(1), createTxRaw(2)];

  it('can initialize the hook', async () => {
    const { result: r } = renderHook(() => useTxMulti());

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
    expect(state.transactions.length).toEqual(rawTxs.length);
    expect(state.transactions).toContainEqual({
      txRaw: { to: 'address1', value: 'any', data: 'empty' },
      _uuid: 'cc85a4c4-8c65-54a7-b286-bac7096b012a',
      status: 'PREPARING'
    });
  });

  it('can initialize the after an async call', async () => {
    const { result: r } = renderHook(() => useTxMulti());

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
    expect(state.transactions.length).toEqual(rawTxs.length);
    expect(state.transactions).toContainEqual({
      txRaw: { to: 'address1', value: 'any', data: 'empty' },
      _uuid: 'cc85a4c4-8c65-54a7-b286-bac7096b012a',
      status: 'PREPARING'
    });
  });

  it('sets state.error if init fails', async () => {
    const { result: r } = renderHook(() => useTxMulti());
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
    const { result: r } = renderHook(() => useTxMulti());
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
});
