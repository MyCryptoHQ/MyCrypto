import { reduceToValues, isFullTx } from 'selectors/transaction/helpers';
import {
  getCurrentTo,
  getCurrentValue,
  getFields,
  getUnit,
  getDataExists,
  getValidGasCost
} from 'selectors/transaction';
import TEST_STATE from './TestState.json';

describe('helpers selector', () => {
  it('should reduce the fields state to its base values', () => {
    const values = {
      data: null,
      gasLimit: '5208',
      gasPrice: '37e11d600',
      nonce: '0',
      to: { data: [0, 1, 2, 3], type: 'Buffer' },
      value: '2386f26fc10000'
    };
    expect(reduceToValues(TEST_STATE.transaction.fields)).toEqual(values);
  });

  it('should check isFullTransaction with full transaction arguments', () => {
    const currentTo = getCurrentTo(TEST_STATE);
    const currentValue = getCurrentValue(TEST_STATE);
    const transactionFields = getFields(TEST_STATE);
    const unit = getUnit(TEST_STATE);
    const dataExists = getDataExists(TEST_STATE);
    const validGasCost = getValidGasCost(TEST_STATE);
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
    const currentValue = getCurrentValue(TEST_STATE);
    const transactionFields = getFields(TEST_STATE);
    const unit = getUnit(TEST_STATE);
    const dataExists = getDataExists(TEST_STATE);
    const validGasCost = getValidGasCost(TEST_STATE);
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
