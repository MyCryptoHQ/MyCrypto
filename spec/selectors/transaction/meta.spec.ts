import {
  getFrom,
  getDecimal,
  getTokenValue,
  getTokenTo,
  getUnit,
  getPreviousUnit,
  getDecimalFromUnit
} from 'selectors/transaction/meta';
import { getInitialState } from '../helpers';

describe('meta tests', () => {
  const state = getInitialState();
  (state.transaction.meta = {
    unit: 'ETH',
    previousUnit: 'ETH',
    decimal: 18,
    tokenValue: {
      raw: '',
      value: null
    },
    tokenTo: {
      raw: '',
      value: null
    },
    from: 'fromAddress'
  }),
    (state.customTokens = [
      {
        address: '0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7',
        symbol: 'UNI',
        decimal: 0
      }
    ]);
  it('should get the stored sender address', () => {
    expect(getFrom(state)).toEqual(state.transaction.meta.from);
  });

  it('should get the stored decimal', () => {
    expect(getDecimal(state)).toEqual(state.transaction.meta.decimal);
  });

  it('should get the token value', () => {
    expect(getTokenValue(state)).toEqual(state.transaction.meta.tokenValue);
  });

  it('should get the token receiver address', () => {
    expect(getTokenTo(state)).toEqual(state.transaction.meta.tokenTo);
  });

  it('should get the stored unit', () => {
    expect(getUnit(state)).toEqual(state.transaction.meta.unit);
  });

  it('should get the stored previous unit', () => {
    expect(getPreviousUnit(state)).toEqual(state.transaction.meta.previousUnit);
  });

  it('should get the decimal for ether', () => {
    expect(getDecimalFromUnit(state, getUnit(state))).toEqual(18);
  });

  it('should get the decimal for a token', () => {
    expect(getDecimalFromUnit(state, 'UNI')).toEqual(0);
  });

  it('should throw error if the token is not found', () => {
    expect(() => getDecimalFromUnit(state, 'ABC')).toThrowError(`Token ABC not found`);
  });
});
