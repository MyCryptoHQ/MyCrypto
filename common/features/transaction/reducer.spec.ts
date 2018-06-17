import EthTx from 'ethereumjs-tx';
import BN from 'bn.js';

import { gasPriceToBase, getDecimalFromEtherUnit } from 'libs/units';
import {
  transactionBroadcastTypes,
  transactionBroadcastActions,
  transactionBroadcastReducer
} from './broadcast';
import {
  transactionFieldsTypes,
  transactionFieldsActions,
  transactionFieldsReducer
} from './fields';
import { transactionMetaTypes, transactionMetaActions, transactionMetaReducer } from './meta';
import {
  transactionNetworkTypes,
  transactionNetworkActions,
  transactionNetworkReducer
} from './network';
import { transactionSignTypes, transactionSignReducer } from './sign';
import * as types from './types';

describe('transaction: Reducers', () => {
  describe('Broadcast', () => {
    const indexingHash = 'testingHash';
    const serializedTransaction = new Buffer('testSerialized');
    const nextTxStatus: transactionBroadcastTypes.ITransactionStatus = {
      broadcastedHash: null,
      broadcastSuccessful: false,
      isBroadcasting: true,
      serializedTransaction
    };
    const nextState: transactionBroadcastTypes.TransactionBroadcastState = {
      ...transactionBroadcastReducer.BROADCAST_INITIAL_STATE,
      [indexingHash]: nextTxStatus
    };
    it('should handle BROADCAST_TRANSACTION_QUEUED', () => {
      expect(
        transactionBroadcastReducer.broadcastReducer(
          transactionBroadcastReducer.BROADCAST_INITIAL_STATE as transactionBroadcastTypes.TransactionBroadcastState,
          transactionBroadcastActions.broadcastTransactionQueued({
            indexingHash,
            serializedTransaction
          })
        )
      ).toEqual(nextState);
    });

    it('should handle BROADCAST_TRANSACTION_SUCCESS', () => {
      const broadcastedHash = 'testBroadcastHash';
      const broadcastedState = {
        ...nextState,
        [indexingHash]: {
          ...nextTxStatus,
          broadcastedHash,
          isBroadcasting: false,
          broadcastSuccessful: true
        }
      };
      expect(
        transactionBroadcastReducer.broadcastReducer(
          nextState,
          transactionBroadcastActions.broadcastTransactionSucceeded({
            indexingHash,
            broadcastedHash
          })
        )
      ).toEqual(broadcastedState);
    });

    it('should handle BROADCAST_TRANSACTION_FAILURE', () => {
      const failedBroadcastState = {
        ...nextState,
        [indexingHash]: { ...nextTxStatus, isBroadcasting: false, broadcastSuccessful: false }
      };
      expect(
        transactionBroadcastReducer.broadcastReducer(
          nextState,
          transactionBroadcastActions.broadcastTransactionFailed({ indexingHash })
        )
      ).toEqual(failedBroadcastState);
    });
  });

  describe('Fields', () => {
    const FIELDS_INITIAL_STATE: transactionFieldsTypes.TransactionFieldsState = {
      to: { raw: '', value: null },
      data: { raw: '', value: null },
      nonce: { raw: '', value: null },
      value: { raw: '', value: null },
      gasLimit: { raw: '21000', value: new BN(21000) },
      gasPrice: { raw: '20', value: gasPriceToBase(20) }
    };
    const testPayload = { raw: 'test', value: null };

    it('should handle TO_FIELD_SET', () => {
      expect(
        transactionFieldsReducer.fieldsReducer(
          FIELDS_INITIAL_STATE,
          transactionFieldsActions.setToField(testPayload)
        )
      ).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload
      });
    });

    it('should handle VALUE_FIELD_SET', () => {
      expect(
        transactionFieldsReducer.fieldsReducer(
          FIELDS_INITIAL_STATE,
          transactionFieldsActions.setValueField(testPayload)
        )
      ).toEqual({
        ...FIELDS_INITIAL_STATE,
        value: testPayload
      });
    });

    it('should handle DATA_FIELD_SET', () => {
      expect(
        transactionFieldsReducer.fieldsReducer(
          FIELDS_INITIAL_STATE,
          transactionFieldsActions.setDataField(testPayload)
        )
      ).toEqual({
        ...FIELDS_INITIAL_STATE,
        data: testPayload
      });
    });

    it('should handle GAS_LIMIT_FIELD_SET', () => {
      expect(
        transactionFieldsReducer.fieldsReducer(
          FIELDS_INITIAL_STATE,
          transactionFieldsActions.setGasLimitField(testPayload)
        )
      ).toEqual({
        ...FIELDS_INITIAL_STATE,
        gasLimit: testPayload
      });
    });

    it('should handle NONCE_SET', () => {
      expect(
        transactionFieldsReducer.fieldsReducer(
          FIELDS_INITIAL_STATE,
          transactionFieldsActions.setNonceField(testPayload)
        )
      ).toEqual({
        ...FIELDS_INITIAL_STATE,
        nonce: testPayload
      });
    });

    it('should handle GAS_PRICE_FIELD_SET', () => {
      expect(
        transactionFieldsReducer.fieldsReducer(
          FIELDS_INITIAL_STATE,
          transactionFieldsActions.setGasPriceField(testPayload)
        )
      ).toEqual({
        ...FIELDS_INITIAL_STATE,
        gasPrice: testPayload
      });
    });

    it('should handle TOKEN_TO_ETHER_SWAP', () => {
      const swapAction: types.SwapTokenToEtherAction = {
        type: types.TransactionActions.TOKEN_TO_ETHER_SWAP,
        payload: {
          to: testPayload,
          value: testPayload,
          decimal: 1
        }
      };
      expect(transactionFieldsReducer.fieldsReducer(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        value: testPayload
      });
    });

    it('should handle ETHER_TO_TOKEN_SWAP', () => {
      const swapAction: types.SwapEtherToTokenAction = {
        type: types.TransactionActions.ETHER_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenTo: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(transactionFieldsReducer.fieldsReducer(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        data: testPayload
      });
    });

    it('should handle TOKEN_TO_TOKEN_SWAP', () => {
      const swapAction: types.SwapTokenToTokenAction = {
        type: types.TransactionActions.TOKEN_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(transactionFieldsReducer.fieldsReducer(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        data: testPayload
      });
    });

    it('should reset', () => {
      const resetAction: types.ResetTransactionSuccessfulAction = {
        type: types.TransactionActions.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: transactionFieldsTypes.TransactionFieldsState = {
        ...FIELDS_INITIAL_STATE,
        data: { raw: 'modified', value: null }
      };
      expect(transactionFieldsReducer.fieldsReducer(modifiedState, resetAction)).toEqual(
        FIELDS_INITIAL_STATE
      );
    });
  });

  describe('Meta', () => {
    const META_INITIAL_STATE: transactionMetaTypes.TransactionMetaState = {
      unit: '',
      previousUnit: '',
      decimal: getDecimalFromEtherUnit('ether'),
      tokenValue: { raw: '', value: null },
      tokenTo: { raw: '', value: null },
      from: null,
      isContractInteraction: false
    };

    const testPayload = { raw: 'test', value: null };

    it('should handle UNIT_META_SET', () => {
      const setUnitMetaAction: transactionMetaTypes.SetUnitMetaAction = {
        type: transactionMetaTypes.TransactionMetaActions.UNIT_META_SET,
        payload: 'test'
      };
      expect(transactionMetaReducer.metaReducer(META_INITIAL_STATE, setUnitMetaAction));
    });

    it('should handle TOKEN_VALUE_META_SET', () => {
      expect(
        transactionMetaReducer.metaReducer(
          META_INITIAL_STATE,
          transactionMetaActions.setTokenValue(testPayload)
        )
      ).toEqual({
        ...META_INITIAL_STATE,
        tokenValue: testPayload
      });
    });

    it('should handle TOKEN_TO_META_SET', () => {
      expect(
        transactionMetaReducer.metaReducer(
          META_INITIAL_STATE,
          transactionMetaActions.setTokenTo(testPayload)
        )
      ).toEqual({
        ...META_INITIAL_STATE,
        tokenTo: testPayload
      });
    });

    it('should handle GET_FROM_SUCCEEDED', () => {
      expect(
        transactionMetaReducer.metaReducer(
          META_INITIAL_STATE,
          transactionNetworkActions.getFromSucceeded('test')
        )
      ).toEqual({
        ...META_INITIAL_STATE,
        from: 'test'
      });
    });

    it('should handle TOKEN_TO_ETHER_SWAP', () => {
      const swapAction: types.SwapTokenToEtherAction = {
        type: types.TransactionActions.TOKEN_TO_ETHER_SWAP,
        payload: {
          to: testPayload,
          value: testPayload,
          decimal: 1
        }
      };
      expect(transactionMetaReducer.metaReducer(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal
      });
    });

    it('should handle ETHER_TO_TOKEN_SWAP', () => {
      const swapAction: types.SwapEtherToTokenAction = {
        type: types.TransactionActions.ETHER_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenTo: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(transactionMetaReducer.metaReducer(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal,
        tokenTo: testPayload,
        tokenValue: testPayload
      });
    });

    it('should handle TOKEN_TO_TOKEN_SWAP', () => {
      const swapAction: types.SwapTokenToTokenAction = {
        type: types.TransactionActions.TOKEN_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(transactionMetaReducer.metaReducer(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal,
        tokenValue: testPayload
      });
    });

    it('should reset', () => {
      const resetAction: types.ResetTransactionSuccessfulAction = {
        type: types.TransactionActions.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: transactionMetaTypes.TransactionMetaState = {
        ...META_INITIAL_STATE,
        unit: 'modified'
      };
      expect(transactionMetaReducer.metaReducer(modifiedState, resetAction)).toEqual(modifiedState);
    });
  });

  describe('Network', () => {
    const NETWORK_INITIAL_STATE: transactionNetworkTypes.TransactionNetworkState = {
      gasEstimationStatus: null,
      getFromStatus: null,
      getNonceStatus: null,
      gasPriceStatus: null
    };

    it('should handle gas estimation status actions', () => {
      const gasEstimationAction: transactionNetworkTypes.TransactionNetworkAction = {
        type: transactionNetworkTypes.TransactionNetworkActions.ESTIMATE_GAS_SUCCEEDED
      };
      expect(
        transactionNetworkReducer.networkReducer(NETWORK_INITIAL_STATE, gasEstimationAction)
      ).toEqual({
        ...NETWORK_INITIAL_STATE,
        gasEstimationStatus: 'SUCCESS'
      });
    });

    it('should handle get from status actions', () => {
      const getFromAction: transactionNetworkTypes.TransactionNetworkAction = {
        type: transactionNetworkTypes.TransactionNetworkActions.GET_FROM_SUCCEEDED,
        payload: 'test'
      };
      expect(
        transactionNetworkReducer.networkReducer(NETWORK_INITIAL_STATE, getFromAction)
      ).toEqual({
        ...NETWORK_INITIAL_STATE,
        getFromStatus: 'SUCCESS'
      });
    });

    it('should handle get nonce status actions', () => {
      const getNonceAction: transactionNetworkTypes.TransactionNetworkAction = {
        type: transactionNetworkTypes.TransactionNetworkActions.GET_NONCE_SUCCEEDED,
        payload: 'test'
      };
      expect(
        transactionNetworkReducer.networkReducer(NETWORK_INITIAL_STATE, getNonceAction)
      ).toEqual({
        ...NETWORK_INITIAL_STATE,
        getNonceStatus: 'SUCCESS'
      });
    });

    it('should handle gasPriceIntent', () => {
      const gasPriceAction: transactionFieldsTypes.InputGasPriceAction = {
        type: transactionFieldsTypes.TransactionFieldsActions.GAS_PRICE_INPUT,
        payload: 'test'
      };
      expect(
        transactionNetworkReducer.networkReducer(NETWORK_INITIAL_STATE, gasPriceAction)
      ).toEqual({
        ...NETWORK_INITIAL_STATE,
        gasPriceStatus: 'SUCCESS'
      });
    });
  });

  describe('Sign', () => {
    const SIGN_INITIAL_STATE: transactionSignTypes.TransactionSignState = {
      local: { signedTransaction: null },
      web3: { transaction: null },
      indexingHash: null,
      pending: false
    };
    it('should handle SIGN_TRANSACTION_REQUESTED', () => {
      const signTxRequestedAction: transactionSignTypes.SignTransactionRequestedAction = {
        type: transactionSignTypes.TransactionSignActions.SIGN_TRANSACTION_REQUESTED,
        payload: {} as EthTx
      };
      expect(transactionSignReducer.signReducer(SIGN_INITIAL_STATE, signTxRequestedAction)).toEqual(
        {
          ...SIGN_INITIAL_STATE,
          pending: true
        }
      );
    });

    it('should handle SIGN_LOCAL_TRANSACTION_SUCCEEDED', () => {
      const signedTransaction = new Buffer('test');
      const indexingHash = 'test';
      const signLocalTxSucceededAction: transactionSignTypes.SignLocalTransactionSucceededAction = {
        type: transactionSignTypes.TransactionSignActions.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
        payload: { signedTransaction, indexingHash }
      };
      expect(
        transactionSignReducer.signReducer(SIGN_INITIAL_STATE, signLocalTxSucceededAction)
      ).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: false,
        indexingHash,
        local: { signedTransaction }
      });
    });

    it('should handle SIGN_WEB3_TRANSACTION_SUCCEEDED', () => {
      const transaction = new Buffer('test');
      const indexingHash = 'test';
      const signWeb3TxSucceededAction: transactionSignTypes.SignWeb3TransactionSucceededAction = {
        type: transactionSignTypes.TransactionSignActions.SIGN_WEB3_TRANSACTION_SUCCEEDED,
        payload: { transaction, indexingHash }
      };
      expect(
        transactionSignReducer.signReducer(SIGN_INITIAL_STATE, signWeb3TxSucceededAction)
      ).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: false,
        indexingHash,
        web3: { transaction }
      });
    });

    it('should reset', () => {
      const resetAction: types.ResetTransactionSuccessfulAction = {
        type: types.TransactionActions.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: transactionSignTypes.TransactionSignState = {
        ...SIGN_INITIAL_STATE,
        pending: true
      };
      expect(transactionSignReducer.signReducer(modifiedState, resetAction)).toEqual(
        SIGN_INITIAL_STATE
      );
    });
  });
});
