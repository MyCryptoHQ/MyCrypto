import { TypeKeys } from 'actions/transaction/constants';
import { getDecimalFromEtherUnit } from 'libs/units';
import { State, meta } from 'reducers/transaction/meta';
import * as txActions from 'actions/transaction';

describe('meta reducer', () => {
  const INITIAL_STATE: State = {
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
    const setUnitMetaAction: txActions.SetUnitMetaAction = {
      type: TypeKeys.UNIT_META_SET,
      payload: 'test'
    };
    expect(meta(INITIAL_STATE, setUnitMetaAction));
  });

  it('should handle TOKEN_VALUE_META_SET', () => {
    expect(meta(INITIAL_STATE, txActions.setTokenValue(testPayload))).toEqual({
      ...INITIAL_STATE,
      tokenValue: testPayload
    });
  });

  it('should handle TOKEN_TO_META_SET', () => {
    expect(meta(INITIAL_STATE, txActions.setTokenTo(testPayload))).toEqual({
      ...INITIAL_STATE,
      tokenTo: testPayload
    });
  });

  it('should handle GET_FROM_SUCCEEDED', () => {
    expect(meta(INITIAL_STATE, txActions.getFromSucceeded('test'))).toEqual({
      ...INITIAL_STATE,
      from: 'test'
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
    expect(meta(INITIAL_STATE, swapAction)).toEqual({
      ...INITIAL_STATE,
      decimal: swapAction.payload.decimal
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
    expect(meta(INITIAL_STATE, swapAction)).toEqual({
      ...INITIAL_STATE,
      decimal: swapAction.payload.decimal,
      tokenTo: testPayload,
      tokenValue: testPayload
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
    expect(meta(INITIAL_STATE, swapAction)).toEqual({
      ...INITIAL_STATE,
      decimal: swapAction.payload.decimal,
      tokenValue: testPayload
    });
  });

  it('should reset', () => {
    const resetAction: txActions.ResetTransactionSuccessfulAction = {
      type: TypeKeys.RESET_SUCCESSFUL,
      payload: { isContractInteraction: false }
    };
    const modifiedState: State = {
      ...INITIAL_STATE,
      unit: 'modified'
    };
    expect(meta(modifiedState, resetAction)).toEqual(INITIAL_STATE);
  });
});
