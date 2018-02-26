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
import TEST_STATE from './TestState.json';

describe('fields selector', () => {
  const fieldState = TEST_STATE.transaction.fields;

  it('should get fields from fields store', () => {
    expect(getFields(TEST_STATE)).toEqual(fieldState);
  });

  it('should get data from fields store', () => {
    expect(getData(TEST_STATE)).toEqual(fieldState.data);
  });

  it('should get gas limit from fields store', () => {
    expect(getGasLimit(TEST_STATE)).toEqual(fieldState.gasLimit);
  });

  it('should get value from fields store', () => {
    expect(getValue(TEST_STATE)).toEqual(fieldState.value);
  });

  it('sould get receiver address from fields store', () => {
    expect(getTo(TEST_STATE)).toEqual(fieldState.to);
  });

  it('should get nonce from fields store', () => {
    expect(getNonce(TEST_STATE)).toEqual(fieldState.nonce);
  });

  it('should get gas price from fields store', () => {
    expect(getGasPrice(TEST_STATE)).toEqual(fieldState.gasPrice);
  });

  it('should check getDataExists', () => {
    expect(getDataExists(TEST_STATE)).toEqual(false);
  });
});
