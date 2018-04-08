import BN from 'bn.js';
import { Wei } from 'libs/units';
import {
  getData,
  getFields,
  getGasLimit,
  getValue,
  getTo,
  getNonce,
  getGasPrice,
  getDataExists,
  getValidGasCost
} from 'selectors/transaction';
import { getInitialState } from '../helpers';

describe('fields selector', () => {
  const state = getInitialState();
  state.transaction.fields = {
    to: {
      raw: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      value: new Buffer([0, 1, 2, 3])
    },
    data: {
      raw: '',
      value: null
    },
    nonce: {
      raw: '0',
      value: new BN('0')
    },
    value: {
      raw: '1000000000',
      value: Wei('1000000000')
    },
    gasLimit: {
      raw: '21000',
      value: Wei('21000')
    },
    gasPrice: {
      raw: '1500',
      value: Wei('1500')
    }
  };

  it('should get fields from fields store', () => {
    expect(getFields(state)).toEqual(state.transaction.fields);
  });

  it('should get data from fields store', () => {
    expect(getData(state)).toEqual(state.transaction.fields.data);
  });

  it('should get gas limit from fields store', () => {
    expect(getGasLimit(state)).toEqual(state.transaction.fields.gasLimit);
  });

  it('should get value from fields store', () => {
    expect(getValue(state)).toEqual(state.transaction.fields.value);
  });

  it('sould get receiver address from fields store', () => {
    expect(getTo(state)).toEqual(state.transaction.fields.to);
  });

  it('should get nonce from fields store', () => {
    expect(getNonce(state)).toEqual(state.transaction.fields.nonce);
  });

  it('should get gas price from fields store', () => {
    expect(getGasPrice(state)).toEqual(state.transaction.fields.gasPrice);
  });

  it('should check getDataExists', () => {
    expect(getDataExists(state)).toEqual(false);
  });

  it('should check when gas cost is valid', () => {
    expect(getValidGasCost(state)).toEqual(true);
  });

  it('should check when gas cost is invalid', () => {
    state.wallet.balance = {
      wei: Wei('0'),
      isPending: false
    };
    expect(getValidGasCost(state)).toEqual(false);
  });
});
