import { useState, useEffect, useCallback } from 'react';
import * as R from 'ramda';

import { ITxStatus, ITxObject } from 'v2/types';

import { useTxSend, TxSendState, TxSendActions } from '../useTxSend';

export type TxParcel = TxSendState & { _queuePos: number } & Pick<
    TxSendActions,
    'prepareTx' | 'sendTx' | 'waitForConfirmation'
  >;
type Updater = (...args: any) => (txs: TxParcel[]) => TxParcel[];

const addQueuePos = (tx: ITxObject, currentIdx: number) => ({ _queuePos: currentIdx, ...tx });

// Update an tx in the queue by 'adjusting' aka. cloning
// the value of the new state into our transactions array.
// (Number, TxParcel) => (TxParcel[]) => TxParcel[]
const updateTxs: Updater = (currentIdx: number, newTxState: TxSendState) =>
  R.adjust(currentIdx, (prevTxState: TxParcel): TxParcel => ({ ...prevTxState, ...newTxState }));

const refreshQueue: Updater = (currentIdx: number, newTxState: TxSendState) =>
  R.pipe(updateTxs(currentIdx, newTxState));

const initializeQueue: Updater = (currentIdx: number, newTxState: TxSendState, formatter) =>
  R.pipe(R.map(formatter), R.addIndex(R.map)(addQueuePos), updateTxs(currentIdx, newTxState));

/*
  Create a queue of transactions the need to be sent in order.
  When you know which txs you want to send you:
  1. call `initQueue([tx1, tx2])`
  2. then with `currentTx` you have access to all the useTxSend methods and status tracking.
  3. when the status of the previous tx is `ITxStatus.CONFIRMED` the queue will
     move to the next tx in line.
*/
export type TUseTxMulti = () => {
  currentTx: TxParcel;
  previousTx: TxParcel;
  transactions: TxParcel[];
  initQueue(txs: any[]): void;
};
export const useTxMulti: TUseTxMulti = () => {
  const { state: txState, ...actions } = useTxSend();
  const [txQueue, setTxQueue] = useState<TxParcel[]>([]);
  const [currentTxIdx, setCurrentTxIdx] = useState(0);
  const currentTx = txQueue[currentTxIdx] || {};

  const initQueue = useCallback(txs => {
    const transactions: TxParcel[] = initializeQueue(
      currentTxIdx,
      txState,
      actions.formatRawTx
    )(txs);
    setTxQueue(transactions);
  }, []);

  // Update the references in our queue whenever the associated tx changes.
  useEffect(() => {
    const updated: TxParcel[] = refreshQueue(currentTxIdx, txState)(txQueue);

    if (updated[currentTxIdx] && updated[currentTxIdx].status === ITxStatus.CONFIRMED) {
      const nextIdx = Math.min(currentTxIdx + 1, updated.length - 1);
      actions.reset();

      setCurrentTxIdx(nextIdx);
      setTxQueue(updated);
      // ie. setCurrentTxIdx(currentTx + 1)
    } else {
      setTxQueue(updated);
    }
  }, [txState]);

  return {
    initQueue,
    get currentTx() {
      return { ...currentTx, ...R.pick(['prepareTx', 'sendTx', 'waitForConfirmation'], actions) }; // share only the relevant actions.
    },
    get previousTx() {
      return txQueue[currentTxIdx - 1];
    },
    transactions: txQueue
  };
};
