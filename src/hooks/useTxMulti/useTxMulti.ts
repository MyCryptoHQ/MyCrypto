import { useContext, useEffect } from 'react';

import { useReducer } from 'reinspect';

import { makePendingTxReceipt, makeTxConfigFromTxResponse } from '@helpers';
import { StoreContext, useAccounts, useAssets } from '@services';
import { ITxObject, ITxStatus, ITxType } from '@types';
import { identity, lensIndex, view } from '@vendor';

import { init, initWith, prepareTx, reset, sendTx, stopYield } from './actions';
import { initialState, TxMultiReducer } from './reducer';
import { TxMultiState, TxParcel } from './types';

/*
  Create a queue of transactions the need to be sent in order.
  When you know which txs you want to send you:
  1. call `init([tx1, tx2])` or `initWith(getTxs, ...)`
  2. when the status of the previous tx is `ITxStatus.CONFIRMED` the queue will
     move to the next tx in line.
*/

export type TUseTxMulti = () => {
  prepareTx: ReturnType<typeof prepareTx>;
  sendTx: ReturnType<typeof sendTx>;
  reset: ReturnType<typeof reset>;
  currentTx: TxParcel;
  state: TxMultiState;
  init(txs: any[], account: any, network: any): Promise<void>;
  initWith(
    getTxs: () => Promise<Partial<ITxObject & { label: string; type: ITxType }>[]>,
    account: any,
    network: any
  ): Promise<void>;
  stopYield(): Promise<void>;
};

export const useTxMulti: TUseTxMulti = () => {
  const [state, dispatch] = useReducer(TxMultiReducer, initialState, identity, 'TxMulti');
  const getState = () => state;
  const { accounts } = useContext(StoreContext);
  const { addTxToAccount, getAccountByAddressAndNetworkName } = useAccounts();
  const { assets } = useAssets();
  const { network, account: stateAccount } = state;
  // Fetch latest account since the one in state can be outdated
  const account =
    stateAccount && getAccountByAddressAndNetworkName(stateAccount.address, stateAccount.networkId);

  const currentTx: TxParcel = view(lensIndex(state._currentTxIdx), state.transactions);

  useEffect(() => {
    if (
      account &&
      network &&
      currentTx &&
      currentTx.txResponse &&
      currentTx.txHash &&
      currentTx.status === ITxStatus.BROADCASTED
    ) {
      const type = currentTx.type ? currentTx.type : ITxType.UNKNOWN;
      const txConfig = makeTxConfigFromTxResponse(currentTx.txResponse, assets, network, accounts);
      const pendingTxReceipt = makePendingTxReceipt(currentTx.txHash)(type, txConfig);
      addTxToAccount(account, pendingTxReceipt);
    }
  }, [currentTx]);

  return {
    state,
    init: init(dispatch),
    initWith: initWith(dispatch),
    stopYield: stopYield(dispatch),
    prepareTx: prepareTx(dispatch, getState),
    sendTx: sendTx(dispatch, getState),
    reset: reset(dispatch),
    currentTx
  };
};
