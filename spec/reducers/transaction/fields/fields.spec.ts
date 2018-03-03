import { TypeKeys } from 'actions/transaction/constants';
import { gasPricetoBase } from 'libs/units';
import { fields, State } from 'reducers/transaction/fields';
import * as txActions from 'actions/transaction';
import BN from 'bn.js';

describe('fields reducer', () => {
  const INITIAL_STATE: State = {
    to: { raw: '', value: null },
    data: { raw: '', value: null },
    nonce: { raw: '', value: null },
    value: { raw: '', value: null },
    gasLimit: { raw: '21000', value: new BN(21000) },
    gasPrice: { raw: '20', value: gasPricetoBase(20) }
  };
  const testPayload = { raw: 'test', value: null };

  it('should handle TO_FIELD_SET', () => {
    expect(fields(INITIAL_STATE, txActions.setToField(testPayload))).toEqual({
      ...INITIAL_STATE,
      to: testPayload
    });
  });

  it('should handle VALUE_FIELD_SET', () => {
    expect(fields(INITIAL_STATE, txActions.setValueField(testPayload))).toEqual({
      ...INITIAL_STATE,
      value: testPayload
    });
  });

  it('should handle DATA_FIELD_SET', () => {
    expect(fields(INITIAL_STATE, txActions.setDataField(testPayload))).toEqual({
      ...INITIAL_STATE,
      data: testPayload
    });
  });

  it('should handle GAS_LIMIT_FIELD_SET', () => {
    expect(fields(INITIAL_STATE, txActions.setGasLimitField(testPayload))).toEqual({
      ...INITIAL_STATE,
      gasLimit: testPayload
    });
  });

  it('should handle NONCE_SET', () => {
    expect(fields(INITIAL_STATE, txActions.setNonceField(testPayload))).toEqual({
      ...INITIAL_STATE,
      nonce: testPayload
    });
  });

  it('should handle GAS_PRICE_FIELD_SET', () => {
    expect(fields(INITIAL_STATE, txActions.setGasPriceField(testPayload))).toEqual({
      ...INITIAL_STATE,
      gasPrice: testPayload
    });
  });

  it('should handle TOKEN_TO_ETHER_SWAP', () => {
    const swapAction: txActions.SwapTokenToEtherAction = {
      type: TypeKeys.TOKEN_TO_ETHER_SWAP,
      payload: {
        to: testPayload,
        value: testPayload,
        decimal: 1
      }
    };
    expect(fields(INITIAL_STATE, swapAction)).toEqual({
      ...INITIAL_STATE,
      to: testPayload,
      value: testPayload
    });
  });

  it('should handle ETHER_TO_TOKEN_SWAP', () => {
    const swapAction: txActions.SwapEtherToTokenAction = {
      type: TypeKeys.ETHER_TO_TOKEN_SWAP,
      payload: {
        to: testPayload,
        data: testPayload,
        tokenTo: testPayload,
        tokenValue: testPayload,
        decimal: 1
      }
    };
    expect(fields(INITIAL_STATE, swapAction)).toEqual({
      ...INITIAL_STATE,
      to: testPayload,
      data: testPayload
    });
  });

  it('should handle TOKEN_TO_TOKEN_SWAP', () => {
    const swapAction: txActions.SwapTokenToTokenAction = {
      type: TypeKeys.TOKEN_TO_TOKEN_SWAP,
      payload: {
        to: testPayload,
        data: testPayload,
        tokenValue: testPayload,
        decimal: 1
      }
    };
    expect(fields(INITIAL_STATE, swapAction)).toEqual({
      ...INITIAL_STATE,
      to: testPayload,
      data: testPayload
    });
  });

  it('should reset', () => {
    const resetAction: txActions.ResetAction = {
      type: TypeKeys.RESET,
      payload: { include: {}, exclude: {} }
    };
    const modifiedState: State = {
      ...INITIAL_STATE,
      data: { raw: 'modified', value: null }
    };
    expect(fields(modifiedState, resetAction)).toEqual(INITIAL_STATE);
  });
});
