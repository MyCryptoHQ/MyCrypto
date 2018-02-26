import {
  getCurrentValue,
  getCurrentTo,
  isEtherTransaction,
  isValidCurrentTo,
  isValidGasPrice,
  isValidGasLimit,
  getCurrentToAddressMessage
} from 'selectors/transaction';
import TEST_STATE from './TestState.json';

describe('current selector', () => {
  const fieldState = TEST_STATE.transaction.fields;
  it('should get stored receiver address on getCurrentTo', () => {
    expect(getCurrentTo(TEST_STATE)).toEqual(fieldState.to);
  });

  it('should get stored value on getCurrentValue', () => {
    expect(getCurrentValue(TEST_STATE)).toEqual(fieldState.value);
  });

  it('should get message to the receiver', () => {
    expect(getCurrentToAddressMessage(TEST_STATE)).toEqual({
      msg: 'Thank you for donating to MyCrypto. TO THE MOON!'
    });
  });

  it('should check isValidGasPrice', () => {
    expect(isValidGasPrice(TEST_STATE)).toEqual(true);
  });

  it('should check isEtherTransaction', () => {
    expect(isEtherTransaction(TEST_STATE)).toEqual(true);
  });

  it('should check isValidGasLimit', () => {
    expect(isValidGasLimit(TEST_STATE)).toEqual(true);
  });

  it('should check isValidCurrentTo', () => {
    expect(isValidCurrentTo(TEST_STATE)).toEqual(true);
  });
});
