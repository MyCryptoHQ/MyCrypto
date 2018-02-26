import {
  getFrom,
  getDecimal,
  getTokenValue,
  getTokenTo,
  getUnit,
  getPreviousUnit,
  getDecimalFromUnit
} from 'selectors/transaction/meta';
import TEST_STATE from './TestState.json';

describe('meta tests', () => {
  const metaState = TEST_STATE.transaction.meta;
  it('should get the stored sender address', () => {
    expect(getFrom(TEST_STATE)).toEqual(metaState.from);
  });

  it('should get the stored decimal', () => {
    expect(getDecimal(TEST_STATE)).toEqual(metaState.decimal);
  });

  it('should get the token value', () => {
    expect(getTokenValue(TEST_STATE)).toEqual(metaState.tokenValue);
  });

  it('should get the token receiver address', () => {
    expect(getTokenTo(TEST_STATE)).toEqual(metaState.tokenTo);
  });

  it('should get the stored unit', () => {
    expect(getUnit(TEST_STATE)).toEqual(metaState.unit);
  });

  it('should get the stored previous unit', () => {
    expect(getPreviousUnit(TEST_STATE)).toEqual(metaState.previousUnit);
  });

  it('should get the decimal for ether', () => {
    expect(getDecimalFromUnit(TEST_STATE, getUnit(TEST_STATE))).toEqual(18);
  });

  it('should get the decimal for a token', () => {
    expect(getDecimalFromUnit(TEST_STATE, 'UNI')).toEqual(0);
  });

  it('should throw error if the token is not found', () => {
    expect(() => getDecimalFromUnit(TEST_STATE, 'ABC')).toThrowError(`Token ABC not found`);
  });
});
