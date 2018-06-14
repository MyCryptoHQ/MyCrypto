import EthTx from 'ethereumjs-tx';
import BN from 'bn.js';

import { gasPriceToBase, getDecimalFromEtherUnit } from 'libs/units';
import {
  broadcastReducer,
  BroadcastState,
  BROADCAST_INITIAL_STATE,
  broadcastTransactionQueued,
  broadcastTransactionSucceeded,
  broadcastTransactionFailed,
  ITransactionStatus
} from './broadcast';
import {
  fieldsReducer,
  FieldsState,
  TRANSACTION_FIELDS,
  setToField,
  setValueField,
  setDataField,
  setGasLimitField,
  setNonceField,
  setGasPriceField,
  InputGasPriceAction
} from './fields';
import {
  metaReducer,
  MetaState,
  TRANSACTION_META,
  SetUnitMetaAction,
  setTokenTo,
  setTokenValue
} from './meta';
import {
  networkReducer,
  NetworkState,
  TRANSACTION_NETWORK,
  NetworkAction,
  getFromSucceeded
} from './network';
import {
  signReducer,
  SignState,
  TRANSACTION_SIGN,
  SignTransactionRequestedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction
} from './sign';
import {
  TRANSACTION,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  ResetTransactionSuccessfulAction
} from './types';

describe('transaction: Reducers', () => {
  describe('Broadcast', () => {
    const indexingHash = 'testingHash';
    const serializedTransaction = new Buffer('testSerialized');
    const nextTxStatus: ITransactionStatus = {
      broadcastedHash: null,
      broadcastSuccessful: false,
      isBroadcasting: true,
      serializedTransaction
    };
    const nextState: BroadcastState = {
      ...BROADCAST_INITIAL_STATE,
      [indexingHash]: nextTxStatus
    };
    it('should handle BROADCAST_TRANSACTION_QUEUED', () => {
      expect(
        broadcastReducer(
          BROADCAST_INITIAL_STATE as BroadcastState,
          broadcastTransactionQueued({ indexingHash, serializedTransaction })
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
        broadcastReducer(
          nextState,
          broadcastTransactionSucceeded({ indexingHash, broadcastedHash })
        )
      ).toEqual(broadcastedState);
    });

    it('should handle BROADCAST_TRANSACTION_FAILURE', () => {
      const failedBroadcastState = {
        ...nextState,
        [indexingHash]: { ...nextTxStatus, isBroadcasting: false, broadcastSuccessful: false }
      };
      expect(broadcastReducer(nextState, broadcastTransactionFailed({ indexingHash }))).toEqual(
        failedBroadcastState
      );
    });
  });

  describe('Fields', () => {
    const FIELDS_INITIAL_STATE: FieldsState = {
      to: { raw: '', value: null },
      data: { raw: '', value: null },
      nonce: { raw: '', value: null },
      value: { raw: '', value: null },
      gasLimit: { raw: '21000', value: new BN(21000) },
      gasPrice: { raw: '20', value: gasPriceToBase(20) }
    };
    const testPayload = { raw: 'test', value: null };

    it('should handle TO_FIELD_SET', () => {
      expect(fieldsReducer(FIELDS_INITIAL_STATE, setToField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload
      });
    });

    it('should handle VALUE_FIELD_SET', () => {
      expect(fieldsReducer(FIELDS_INITIAL_STATE, setValueField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        value: testPayload
      });
    });

    it('should handle DATA_FIELD_SET', () => {
      expect(fieldsReducer(FIELDS_INITIAL_STATE, setDataField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        data: testPayload
      });
    });

    it('should handle GAS_LIMIT_FIELD_SET', () => {
      expect(fieldsReducer(FIELDS_INITIAL_STATE, setGasLimitField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        gasLimit: testPayload
      });
    });

    it('should handle NONCE_SET', () => {
      expect(fieldsReducer(FIELDS_INITIAL_STATE, setNonceField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        nonce: testPayload
      });
    });

    it('should handle GAS_PRICE_FIELD_SET', () => {
      expect(fieldsReducer(FIELDS_INITIAL_STATE, setGasPriceField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        gasPrice: testPayload
      });
    });

    it('should handle TOKEN_TO_ETHER_SWAP', () => {
      const swapAction: SwapTokenToEtherAction = {
        type: TRANSACTION.TOKEN_TO_ETHER_SWAP,
        payload: {
          to: testPayload,
          value: testPayload,
          decimal: 1
        }
      };
      expect(fieldsReducer(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        value: testPayload
      });
    });

    it('should handle ETHER_TO_TOKEN_SWAP', () => {
      const swapAction: SwapEtherToTokenAction = {
        type: TRANSACTION.ETHER_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenTo: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(fieldsReducer(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        data: testPayload
      });
    });

    it('should handle TOKEN_TO_TOKEN_SWAP', () => {
      const swapAction: SwapTokenToTokenAction = {
        type: TRANSACTION.TOKEN_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(fieldsReducer(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        data: testPayload
      });
    });

    it('should reset', () => {
      const resetAction: ResetTransactionSuccessfulAction = {
        type: TRANSACTION.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: FieldsState = {
        ...FIELDS_INITIAL_STATE,
        data: { raw: 'modified', value: null }
      };
      expect(fieldsReducer(modifiedState, resetAction)).toEqual(FIELDS_INITIAL_STATE);
    });
  });

  describe('Meta', () => {
    const META_INITIAL_STATE: MetaState = {
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
      const setUnitMetaAction: SetUnitMetaAction = {
        type: TRANSACTION_META.UNIT_META_SET,
        payload: 'test'
      };
      expect(metaReducer(META_INITIAL_STATE, setUnitMetaAction));
    });

    it('should handle TOKEN_VALUE_META_SET', () => {
      expect(metaReducer(META_INITIAL_STATE, setTokenValue(testPayload))).toEqual({
        ...META_INITIAL_STATE,
        tokenValue: testPayload
      });
    });

    it('should handle TOKEN_TO_META_SET', () => {
      expect(metaReducer(META_INITIAL_STATE, setTokenTo(testPayload))).toEqual({
        ...META_INITIAL_STATE,
        tokenTo: testPayload
      });
    });

    it('should handle GET_FROM_SUCCEEDED', () => {
      expect(metaReducer(META_INITIAL_STATE, getFromSucceeded('test'))).toEqual({
        ...META_INITIAL_STATE,
        from: 'test'
      });
    });

    it('should handle TOKEN_TO_ETHER_SWAP', () => {
      const swapAction: SwapTokenToEtherAction = {
        type: TRANSACTION.TOKEN_TO_ETHER_SWAP,
        payload: {
          to: testPayload,
          value: testPayload,
          decimal: 1
        }
      };
      expect(metaReducer(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal
      });
    });

    it('should handle ETHER_TO_TOKEN_SWAP', () => {
      const swapAction: SwapEtherToTokenAction = {
        type: TRANSACTION.ETHER_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenTo: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(metaReducer(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal,
        tokenTo: testPayload,
        tokenValue: testPayload
      });
    });

    it('should handle TOKEN_TO_TOKEN_SWAP', () => {
      const swapAction: SwapTokenToTokenAction = {
        type: TRANSACTION.TOKEN_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(metaReducer(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal,
        tokenValue: testPayload
      });
    });

    it('should reset', () => {
      const resetAction: ResetTransactionSuccessfulAction = {
        type: TRANSACTION.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: MetaState = {
        ...META_INITIAL_STATE,
        unit: 'modified'
      };
      expect(metaReducer(modifiedState, resetAction)).toEqual(modifiedState);
    });
  });

  describe('Network', () => {
    const NETWORK_INITIAL_STATE: NetworkState = {
      gasEstimationStatus: null,
      getFromStatus: null,
      getNonceStatus: null,
      gasPriceStatus: null
    };

    it('should handle gas estimation status actions', () => {
      const gasEstimationAction: NetworkAction = {
        type: TRANSACTION_NETWORK.ESTIMATE_GAS_SUCCEEDED
      };
      expect(networkReducer(NETWORK_INITIAL_STATE, gasEstimationAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        gasEstimationStatus: 'SUCCESS'
      });
    });

    it('should handle get from status actions', () => {
      const getFromAction: NetworkAction = {
        type: TRANSACTION_NETWORK.GET_FROM_SUCCEEDED,
        payload: 'test'
      };
      expect(networkReducer(NETWORK_INITIAL_STATE, getFromAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        getFromStatus: 'SUCCESS'
      });
    });

    it('should handle get nonce status actions', () => {
      const getNonceAction: NetworkAction = {
        type: TRANSACTION_NETWORK.GET_NONCE_SUCCEEDED,
        payload: 'test'
      };
      expect(networkReducer(NETWORK_INITIAL_STATE, getNonceAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        getNonceStatus: 'SUCCESS'
      });
    });

    it('should handle gasPriceIntent', () => {
      const gasPriceAction: InputGasPriceAction = {
        type: TRANSACTION_FIELDS.GAS_PRICE_INPUT,
        payload: 'test'
      };
      expect(networkReducer(NETWORK_INITIAL_STATE, gasPriceAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        gasPriceStatus: 'SUCCESS'
      });
    });
  });

  describe('Sign', () => {
    const SIGN_INITIAL_STATE: SignState = {
      local: { signedTransaction: null },
      web3: { transaction: null },
      indexingHash: null,
      pending: false
    };
    it('should handle SIGN_TRANSACTION_REQUESTED', () => {
      const signTxRequestedAction: SignTransactionRequestedAction = {
        type: TRANSACTION_SIGN.SIGN_TRANSACTION_REQUESTED,
        payload: {} as EthTx
      };
      expect(signReducer(SIGN_INITIAL_STATE, signTxRequestedAction)).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: true
      });
    });

    it('should handle SIGN_LOCAL_TRANSACTION_SUCCEEDED', () => {
      const signedTransaction = new Buffer('test');
      const indexingHash = 'test';
      const signLocalTxSucceededAction: SignLocalTransactionSucceededAction = {
        type: TRANSACTION_SIGN.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
        payload: { signedTransaction, indexingHash }
      };
      expect(signReducer(SIGN_INITIAL_STATE, signLocalTxSucceededAction)).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: false,
        indexingHash,
        local: { signedTransaction }
      });
    });

    it('should handle SIGN_WEB3_TRANSACTION_SUCCEEDED', () => {
      const transaction = new Buffer('test');
      const indexingHash = 'test';
      const signWeb3TxSucceededAction: SignWeb3TransactionSucceededAction = {
        type: TRANSACTION_SIGN.SIGN_WEB3_TRANSACTION_SUCCEEDED,
        payload: { transaction, indexingHash }
      };
      expect(signReducer(SIGN_INITIAL_STATE, signWeb3TxSucceededAction)).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: false,
        indexingHash,
        web3: { transaction }
      });
    });

    it('should reset', () => {
      const resetAction: ResetTransactionSuccessfulAction = {
        type: TRANSACTION.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: SignState = {
        ...SIGN_INITIAL_STATE,
        pending: true
      };
      expect(signReducer(modifiedState, resetAction)).toEqual(SIGN_INITIAL_STATE);
    });
  });
});
