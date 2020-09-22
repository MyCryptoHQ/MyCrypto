import { DEFAULT_NETWORK } from '@config';
import { fTxReceipt } from '@fixtures';
import translate from '@translations';

import { ReducerAction, txStatusReducer } from './TxStatus.reducer';

const dispatch = (action: ReducerAction) => (state: any) => txStatusReducer(state, action);

const TX_HASH = '0x949b7cbfcc4d7a82c83221de4f9e153ce5a161e10722216dae3bcb6eadd9b34c';

describe('TxStatusReducer', () => {
  describe('SET_NETWORK', () => {
    it('can update network with payload', () => {
      const payload = DEFAULT_NETWORK;
      const prevState = { networkId: 'Ropsten' };

      const newState = dispatch({ type: txStatusReducer.actionTypes.SET_NETWORK, payload })(
        prevState
      );

      expect(newState.networkId).toBe(payload);
    });
  });
  describe('SET_TX_HASH', () => {
    it('can update txHash with payload', () => {
      const payload = TX_HASH;
      const prevState = { networkId: DEFAULT_NETWORK };

      const newState = dispatch({ type: txStatusReducer.actionTypes.SET_TX_HASH, payload })(
        prevState
      );

      expect(newState.txHash).toBe(payload);
      expect(newState.networkId).toBe(prevState.networkId);
    });
  });
  describe('FETCH_TX', () => {
    it('can update fetching flag', () => {
      const prevState = { networkId: DEFAULT_NETWORK, txHash: TX_HASH };

      const payload = true;

      const newState = dispatch({ type: txStatusReducer.actionTypes.FETCH_TX, payload })(prevState);

      expect(newState.fetching).toBe(true);
      expect(newState.fromLink).toBe(payload);
    });

    it('can update fromLink flag', () => {
      const prevState = { networkId: DEFAULT_NETWORK, txHash: TX_HASH };

      const payload = false;

      const newState = dispatch({ type: txStatusReducer.actionTypes.FETCH_TX, payload })(prevState);

      expect(newState.fetching).toBe(true);
      expect(newState.fromLink).toBe(payload);
    });
  });
  describe('FETCH_TX_SUCCESS', () => {
    it('can update values', () => {
      const payload = { cachedTx: fTxReceipt };
      const prevState = { networkId: DEFAULT_NETWORK, txHash: TX_HASH, fromLink: true };

      const newState = dispatch({ type: txStatusReducer.actionTypes.FETCH_TX_SUCCESS, payload })(
        prevState
      );

      expect(newState.fetching).toBe(false);
      expect(newState.fromLink).toBe(false);
      expect(newState.error).toBeUndefined();
      expect(newState.tx).toBe(payload);
      expect(newState.txHash).toBe(prevState.txHash);
      expect(newState.networkId).toBe(prevState.networkId);
    });
  });
  describe('FETCH_TX_ERROR', () => {
    it('can update values with error', () => {
      const prevState = { networkId: DEFAULT_NETWORK, txHash: TX_HASH, fromLink: true };

      const newState = dispatch({ type: txStatusReducer.actionTypes.FETCH_TX_ERROR })(prevState);

      expect(newState.fetching).toBe(false);
      expect(newState.fromLink).toBe(false);
      expect(newState.error).toStrictEqual(translate('TX_NOT_FOUND'));
      expect(newState.tx).toBeUndefined();
    });
  });
  describe('CLEAR_FORM', () => {
    it('can clear form values', () => {
      const prevState = { networkId: 'Ropsten', txHash: TX_HASH };

      const newState = dispatch({ type: txStatusReducer.actionTypes.CLEAR_FORM })(prevState);

      expect(newState.fetching).toBe(false);
      expect(newState.error).toBeUndefined();
      expect(newState.txHash).toBe('');
      expect(newState.tx).toBeUndefined();
      expect(newState.networkId).toBe(DEFAULT_NETWORK);
    });
  });
});
