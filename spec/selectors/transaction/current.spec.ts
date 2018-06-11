import { Wei } from 'libs/units';
import {
  getCurrentValue,
  getCurrentTo,
  isEtherTransaction,
  isValidCurrentTo,
  isValidGasPrice,
  isValidGasLimit,
  getCurrentToAddressMessage,
  isCurrentToLabelEntry
} from 'selectors/transaction';
import { getInitialState } from '../helpers';

describe('current selector', () => {
  const state = getInitialState();
  state.transaction = {
    ...state.transaction,
    fields: {
      ...state.transaction.fields,
      to: {
        raw: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
        value: new Buffer([0, 1, 2, 3])
      },
      gasLimit: {
        raw: '21000',
        value: Wei('21000')
      },
      gasPrice: {
        raw: '1500',
        value: Wei('1500')
      }
    },
    meta: {
      ...state.transaction.meta,
      unit: 'ETH',
      previousUnit: 'ETH'
    }
  };

  it('should get stored receiver address on getCurrentTo', () => {
    expect(getCurrentTo(state)).toEqual(state.transaction.fields.to);
  });

  it('should get stored value on getCurrentValue', () => {
    expect(getCurrentValue(state)).toEqual(state.transaction.fields.value);
  });

  it('should get message to the receiver', () => {
    expect(getCurrentToAddressMessage(state)).toEqual({
      msg: 'Thank you for donating to MyCrypto. TO THE MOON!'
    });
  });

  it('should check isValidGasPrice', () => {
    expect(isValidGasPrice(state)).toEqual(true);
  });

  it('should check isEtherTransaction', () => {
    expect(isEtherTransaction(state)).toEqual(true);
  });

  it('should check isValidGasLimit', () => {
    expect(isValidGasLimit(state)).toEqual(true);
  });

  it('should check isValidCurrentTo', () => {
    expect(isValidCurrentTo(state)).toEqual(true);
  });

  it('should check isCurrentToLabelEntry', () => {
    expect(isCurrentToLabelEntry(state)).toEqual(false);

    const otherState = { ...state };
    otherState.transaction = {
      ...state.transaction,
      fields: { ...state.transaction.fields, to: { ...state.transaction.fields.to, raw: 'derp' } }
    };

    expect(isCurrentToLabelEntry(otherState)).toEqual(true);
  });
});
