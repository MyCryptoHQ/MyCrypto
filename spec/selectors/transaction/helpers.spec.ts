import { Wei } from 'libs/units';
import { reduceToValues, isFullTx } from 'selectors/transaction/helpers';
import {
  getCurrentTo,
  getCurrentValue,
  getFields,
  getUnit,
  getDataExists,
  getValidGasCost
} from 'selectors/transaction';
import { getInitialState } from '../helpers';

describe('helpers selector', () => {
  const state = getInitialState();
  state.transaction.fields = {
    to: {
      raw: '0x4bbeEB066eD09B7AEd07bF39EEe0460DFa261520',
      value: {
        type: 'Buffer',
        data: [0, 1, 2, 3]
      }
    },
    data: {
      raw: '',
      value: null
    },
    nonce: {
      raw: '0',
      value: '0'
    },
    value: {
      raw: '0.01',
      value: '2386f26fc10000'
    },
    gasLimit: {
      raw: '21000',
      value: Wei('21000')
    },
    gasPrice: {
      raw: '15',
      value: Wei('15')
    }
  };
  it('should reduce the fields state to its base values', () => {
    const values = {
      data: null,
      gasLimit: Wei('21000'),
      gasPrice: Wei('15'),
      nonce: '0',
      to: { data: [0, 1, 2, 3], type: 'Buffer' },
      value: '2386f26fc10000'
    };
    expect(reduceToValues(state.transaction.fields)).toEqual(values);
  });

  it('should check isFullTransaction with full transaction arguments', () => {
    const currentTo = getCurrentTo(state);
    const currentValue = getCurrentValue(state);
    const transactionFields = getFields(state);
    const unit = getUnit(state);
    const dataExists = getDataExists(state);
    const validGasCost = getValidGasCost(state);
    const isFullTransaction = isFullTx(
      transactionFields,
      currentTo,
      currentValue,
      dataExists,
      validGasCost,
      unit
    );
    expect(isFullTransaction).toEqual(true);
  });

  it('should check isFullTransaction without full transaction arguments', () => {
    const currentTo = { raw: '', value: null };
    const currentValue = getCurrentValue(state);
    const transactionFields = getFields(state);
    const unit = getUnit(state);
    const dataExists = getDataExists(state);
    const validGasCost = getValidGasCost(state);
    const isFullTransaction = isFullTx(
      transactionFields,
      currentTo,
      currentValue,
      dataExists,
      validGasCost,
      unit
    );
    expect(isFullTransaction).toEqual(false);
  });
});
