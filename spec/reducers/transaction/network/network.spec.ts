import { State, network } from 'reducers/transaction/network';
import * as txActions from 'actions/transaction';
import { TypeKeys } from 'actions/transaction/constants';

describe('network reducer', () => {
  const INITIAL_STATE: State = {
    gasEstimationStatus: null,
    getFromStatus: null,
    getNonceStatus: null,
    gasPriceStatus: null
  };

  it('should handle gas estimation status actions', () => {
    const gasEstimationAction: txActions.NetworkAction = {
      type: TypeKeys.ESTIMATE_GAS_SUCCEEDED
    };
    expect(network(INITIAL_STATE, gasEstimationAction)).toEqual({
      ...INITIAL_STATE,
      gasEstimationStatus: 'SUCCESS'
    });
  });

  it('should handle get from status actions', () => {
    const getFromAction: txActions.NetworkAction = {
      type: TypeKeys.GET_FROM_SUCCEEDED,
      payload: 'test'
    };
    expect(network(INITIAL_STATE, getFromAction)).toEqual({
      ...INITIAL_STATE,
      getFromStatus: 'SUCCESS'
    });
  });

  it('should handle get nonce status actions', () => {
    const getNonceAction: txActions.NetworkAction = {
      type: TypeKeys.GET_NONCE_SUCCEEDED,
      payload: 'test'
    };
    expect(network(INITIAL_STATE, getNonceAction)).toEqual({
      ...INITIAL_STATE,
      getNonceStatus: 'SUCCESS'
    });
  });

  it('should handle gasPriceIntent', () => {
    const gasPriceAction: txActions.InputGasPriceAction = {
      type: TypeKeys.GAS_PRICE_INPUT,
      payload: 'test'
    };
    expect(network(INITIAL_STATE, gasPriceAction)).toEqual({
      ...INITIAL_STATE,
      gasPriceStatus: 'SUCCESS'
    });
  });
});
