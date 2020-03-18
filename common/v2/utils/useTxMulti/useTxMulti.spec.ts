import { renderHook, act } from '@testing-library/react-hooks';
import { ValuesType } from 'utility-types';

import { fAccount, fTxReceiptProvider } from '@fixtures';
import { ITxStatus } from 'v2/types';
import { ProviderHandler } from 'v2/services';

import { getUUID } from '../generateUUID';
import { useTxMulti, TxParcel } from './useTxMulti';
import * as Gas from 'v2/services/ApiService/Gas/gasPriceFunctions';
import * as Nonce from 'v2/services/EthService/nonce';

jest.spyOn(Gas, 'getGasEstimate').mockImplementation(jest.fn(() => Promise.resolve('0x01010')));
jest.spyOn(Nonce, 'getNonce').mockImplementation(jest.fn(() => Promise.resolve(34)));
jest
  .spyOn(ProviderHandler.prototype, 'waitForTransaction')
  .mockImplementation(() => Promise.resolve(fTxReceiptProvider));

const createTxRaw = (idx: number) => ({
  to: 'address' + idx,
  value: 'any',
  data: 'empty'
});

const data = [createTxRaw(1), createTxRaw(2)];

describe('useTxMulti', () => {
  // Limit the scopes of the mocks to the current tests.
  afterAll(() => jest.resetAllMocks());

  it('can initialize a transaction queue', () => {
    const { result } = renderHook(() => useTxMulti());
    const { initQueue } = result.current;

    act(() => initQueue(data));
    const currentTx = result.current.currentTx;
    expect(currentTx.txRaw).toEqual(data[0]);
    expect(currentTx.status).toEqual(ITxStatus.EMPTY);
    expect(currentTx._uuid).toEqual(getUUID(JSON.stringify(data[0])));
  });

  it('can return the appropriate actions for currentTx', () => {
    const { result } = renderHook(() => useTxMulti());
    const { initQueue } = result.current;

    act(() => initQueue(data));
    const currentTx = result.current.currentTx;

    expect(currentTx.prepareTx).toBeDefined();
    expect(currentTx.sendTx).toBeDefined();
    expect(currentTx.waitForConfirmation).toBeDefined();
  });

  it('can move to next in list', () => {
    const { result } = renderHook(() => useTxMulti());
    const { initQueue } = result.current;

    act(() => {
      initQueue(data);
    });
    const currentTx = result.current.currentTx;
    expect(currentTx.txRaw).toEqual(data[0]);
    expect(currentTx.status).toEqual(ITxStatus.EMPTY);
    expect(currentTx._uuid).toEqual(getUUID(JSON.stringify(data[0])));
  });

  it('the currentTx is reactive', async () => {
    const { result } = renderHook(() => useTxMulti());
    const { initQueue } = result.current;
    const getProp = (
      prop: keyof ReturnType<typeof useTxMulti>
    ): ValuesType<ReturnType<typeof useTxMulti>> => result.current[prop];

    // Run the 'prepareTx' and expect the status of the 'currentTx' to be
    // updated.
    let currentTx;
    act(() => initQueue(data));
    await act(async () => {
      currentTx = getProp('currentTx') as TxParcel;
      await currentTx.prepareTx(currentTx.txRaw!, fAccount);
    });

    currentTx = getProp('currentTx') as TxParcel;
    expect(currentTx.status).toEqual(ITxStatus.READY);
  });

  it('moves to next in queue on confirmed', async () => {
    const { result } = renderHook(() => useTxMulti());
    const { initQueue } = result.current;
    const getProp = (prop: keyof ReturnType<typeof useTxMulti>) => result.current[prop];

    // Run the 'prepareTx' and expect the status of the 'currentTx' to be
    // updated.
    let currentTx;
    act(() => initQueue(data));
    await act(async () => {
      currentTx = getProp('currentTx') as TxParcel;
      await currentTx.prepareTx(currentTx.txRaw!, fAccount);
      await currentTx.waitForConfirmation(fTxReceiptProvider.transactionHash, fAccount);
    });
    currentTx = getProp('currentTx') as TxParcel;
    const previousTx = getProp('previousTx') as TxParcel;
    expect(previousTx.status).toEqual(ITxStatus.CONFIRMED);
    expect(currentTx._queuePos).toEqual(1);
  });
});
