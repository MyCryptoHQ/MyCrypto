import EthTx from 'ethereumjs-tx';
import BN from 'bn.js';

import { gasPriceToBase, getDecimalFromEtherUnit } from 'libs/units';
import {
  TypeKeys,
  SwapTokenToEtherAction,
  SwapEtherToTokenAction,
  SwapTokenToTokenAction,
  ResetTransactionSuccessfulAction,
  SetUnitMetaAction,
  NetworkAction,
  SignTransactionRequestedAction,
  SignLocalTransactionSucceededAction,
  SignWeb3TransactionSucceededAction
} from './types';
import { ITransactionStatus } from './broadcast/types';
import { InputGasPriceAction } from './fields/types';
import {
  broadcastTransactionQueued,
  broadcastTransactionSucceeded,
  broadcastTransactionFailed
} from './broadcast/actions';
import {
  setToField,
  setValueField,
  setDataField,
  setGasLimitField,
  setNonceField,
  setGasPriceField
} from './fields/actions';
import { setTokenTo, setTokenValue } from './meta/actions';
import { getFromSucceeded } from './network/actions';
import network, { NetworkState } from './network/reducer';
import broadcast, { BROADCAST_INITIAL_STATE } from './broadcast/reducer';
import fields, { FieldsState } from './fields/reducer';
import meta, { MetaState } from './meta/reducer';
import sign, { SignState } from './sign/reducer';

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
    const nextState: any = {
      ...BROADCAST_INITIAL_STATE,
      [indexingHash]: nextTxStatus
    };
    it('should handle BROADCAST_TRANSACTION_QUEUED', () => {
      expect(
        broadcast(
          BROADCAST_INITIAL_STATE as any,
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
        broadcast(nextState, broadcastTransactionSucceeded({ indexingHash, broadcastedHash }))
      ).toEqual(broadcastedState);
    });

    it('should handle BROADCAST_TRANSACTION_FAILURE', () => {
      const failedBroadcastState = {
        ...nextState,
        [indexingHash]: { ...nextTxStatus, isBroadcasting: false, broadcastSuccessful: false }
      };
      expect(broadcast(nextState, broadcastTransactionFailed({ indexingHash }))).toEqual(
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
      expect(fields(FIELDS_INITIAL_STATE, setToField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload
      });
    });

    it('should handle VALUE_FIELD_SET', () => {
      expect(fields(FIELDS_INITIAL_STATE, setValueField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        value: testPayload
      });
    });

    it('should handle DATA_FIELD_SET', () => {
      expect(fields(FIELDS_INITIAL_STATE, setDataField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        data: testPayload
      });
    });

    it('should handle GAS_LIMIT_FIELD_SET', () => {
      expect(fields(FIELDS_INITIAL_STATE, setGasLimitField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        gasLimit: testPayload
      });
    });

    it('should handle NONCE_SET', () => {
      expect(fields(FIELDS_INITIAL_STATE, setNonceField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        nonce: testPayload
      });
    });

    it('should handle GAS_PRICE_FIELD_SET', () => {
      expect(fields(FIELDS_INITIAL_STATE, setGasPriceField(testPayload))).toEqual({
        ...FIELDS_INITIAL_STATE,
        gasPrice: testPayload
      });
    });

    it('should handle TOKEN_TO_ETHER_SWAP', () => {
      const swapAction: SwapTokenToEtherAction = {
        type: TypeKeys.TOKEN_TO_ETHER_SWAP,
        payload: {
          to: testPayload,
          value: testPayload,
          decimal: 1
        }
      };
      expect(fields(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        value: testPayload
      });
    });

    it('should handle ETHER_TO_TOKEN_SWAP', () => {
      const swapAction: SwapEtherToTokenAction = {
        type: TypeKeys.ETHER_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenTo: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(fields(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        data: testPayload
      });
    });

    it('should handle TOKEN_TO_TOKEN_SWAP', () => {
      const swapAction: SwapTokenToTokenAction = {
        type: TypeKeys.TOKEN_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(fields(FIELDS_INITIAL_STATE, swapAction)).toEqual({
        ...FIELDS_INITIAL_STATE,
        to: testPayload,
        data: testPayload
      });
    });

    it('should reset', () => {
      const resetAction: ResetTransactionSuccessfulAction = {
        type: TypeKeys.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: FieldsState = {
        ...FIELDS_INITIAL_STATE,
        data: { raw: 'modified', value: null }
      };
      expect(fields(modifiedState, resetAction)).toEqual(FIELDS_INITIAL_STATE);
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
        type: TypeKeys.UNIT_META_SET,
        payload: 'test'
      };
      expect(meta(META_INITIAL_STATE, setUnitMetaAction));
    });

    it('should handle TOKEN_VALUE_META_SET', () => {
      expect(meta(META_INITIAL_STATE, setTokenValue(testPayload))).toEqual({
        ...META_INITIAL_STATE,
        tokenValue: testPayload
      });
    });

    it('should handle TOKEN_TO_META_SET', () => {
      expect(meta(META_INITIAL_STATE, setTokenTo(testPayload))).toEqual({
        ...META_INITIAL_STATE,
        tokenTo: testPayload
      });
    });

    it('should handle GET_FROM_SUCCEEDED', () => {
      expect(meta(META_INITIAL_STATE, getFromSucceeded('test'))).toEqual({
        ...META_INITIAL_STATE,
        from: 'test'
      });
    });

    it('should handle TOKEN_TO_ETHER_SWAP', () => {
      const swapAction: SwapTokenToEtherAction = {
        type: TypeKeys.TOKEN_TO_ETHER_SWAP,
        payload: {
          to: testPayload,
          value: testPayload,
          decimal: 1
        }
      };
      expect(meta(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal
      });
    });

    it('should handle ETHER_TO_TOKEN_SWAP', () => {
      const swapAction: SwapEtherToTokenAction = {
        type: TypeKeys.ETHER_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenTo: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(meta(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal,
        tokenTo: testPayload,
        tokenValue: testPayload
      });
    });

    it('should handle TOKEN_TO_TOKEN_SWAP', () => {
      const swapAction: SwapTokenToTokenAction = {
        type: TypeKeys.TOKEN_TO_TOKEN_SWAP,
        payload: {
          to: testPayload,
          data: testPayload,
          tokenValue: testPayload,
          decimal: 1
        }
      };
      expect(meta(META_INITIAL_STATE, swapAction)).toEqual({
        ...META_INITIAL_STATE,
        decimal: swapAction.payload.decimal,
        tokenValue: testPayload
      });
    });

    it('should reset', () => {
      const resetAction: ResetTransactionSuccessfulAction = {
        type: TypeKeys.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: MetaState = {
        ...META_INITIAL_STATE,
        unit: 'modified'
      };
      expect(meta(modifiedState, resetAction)).toEqual(modifiedState);
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
        type: TypeKeys.ESTIMATE_GAS_SUCCEEDED
      };
      expect(network(NETWORK_INITIAL_STATE, gasEstimationAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        gasEstimationStatus: 'SUCCESS'
      });
    });

    it('should handle get from status actions', () => {
      const getFromAction: NetworkAction = {
        type: TypeKeys.GET_FROM_SUCCEEDED,
        payload: 'test'
      };
      expect(network(NETWORK_INITIAL_STATE, getFromAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        getFromStatus: 'SUCCESS'
      });
    });

    it('should handle get nonce status actions', () => {
      const getNonceAction: NetworkAction = {
        type: TypeKeys.GET_NONCE_SUCCEEDED,
        payload: 'test'
      };
      expect(network(NETWORK_INITIAL_STATE, getNonceAction)).toEqual({
        ...NETWORK_INITIAL_STATE,
        getNonceStatus: 'SUCCESS'
      });
    });

    it('should handle gasPriceIntent', () => {
      const gasPriceAction: InputGasPriceAction = {
        type: TypeKeys.GAS_PRICE_INPUT,
        payload: 'test'
      };
      expect(network(NETWORK_INITIAL_STATE, gasPriceAction)).toEqual({
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
        type: TypeKeys.SIGN_TRANSACTION_REQUESTED,
        payload: {} as EthTx
      };
      expect(sign(SIGN_INITIAL_STATE, signTxRequestedAction)).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: true
      });
    });

    it('should handle SIGN_LOCAL_TRANSACTION_SUCCEEDED', () => {
      const signedTransaction = new Buffer('test');
      const indexingHash = 'test';
      const signLocalTxSucceededAction: SignLocalTransactionSucceededAction = {
        type: TypeKeys.SIGN_LOCAL_TRANSACTION_SUCCEEDED,
        payload: { signedTransaction, indexingHash }
      };
      expect(sign(SIGN_INITIAL_STATE, signLocalTxSucceededAction)).toEqual({
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
        type: TypeKeys.SIGN_WEB3_TRANSACTION_SUCCEEDED,
        payload: { transaction, indexingHash }
      };
      expect(sign(SIGN_INITIAL_STATE, signWeb3TxSucceededAction)).toEqual({
        ...SIGN_INITIAL_STATE,
        pending: false,
        indexingHash,
        web3: { transaction }
      });
    });

    it('should reset', () => {
      const resetAction: ResetTransactionSuccessfulAction = {
        type: TypeKeys.RESET_SUCCESSFUL,
        payload: { isContractInteraction: false }
      };
      const modifiedState: SignState = {
        ...SIGN_INITIAL_STATE,
        pending: true
      };
      expect(sign(modifiedState, resetAction)).toEqual(SIGN_INITIAL_STATE);
    });
  });
});
