import { call, put } from 'redux-saga/effects';
import { setDataField, setGasLimitField, setNonceField } from 'actions/transaction/actionCreators';
import { isValidHex, isValidNonce } from 'libs/validators';
import { Data, Wei, Nonce } from 'libs/units';
import {
  handleDataInput,
  handleGasLimitInput,
  handleNonceInput
} from 'sagas/transaction/fields/fields';
import { cloneableGenerator } from 'redux-saga/utils';

const itShouldBeDone = gen => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('handleDataInput*', () => {
  const payload = 'payload';
  const action: any = { payload };
  const validData = true;

  const gens: any = {};
  gens.gen = cloneableGenerator(handleDataInput)(action);

  it('should put call isValidHex with payload', () => {
    expect(gens.gen.next().value).toEqual(call(isValidHex, payload));
  });

  it('should put setDataField with null value when data is invalid', () => {
    gens.clone = gens.gen.clone();
    expect(gens.clone.next(!validData).value).toEqual(
      put(
        setDataField({
          raw: payload,
          value: null
        })
      )
    );
  });

  it('should put setDataField with parsed value', () => {
    expect(gens.gen.next(validData).value).toEqual(
      put(
        setDataField({
          raw: payload,
          value: Data(payload)
        })
      )
    );
  });

  itShouldBeDone(gens.gen);
});

describe('handleGasLimitInput*', () => {
  const payload1 = 'invalidPayload';
  const action1: any = { payload: payload1 };
  const payload2 = '100.111';
  const action2: any = { payload: payload2 };

  const gen1 = handleGasLimitInput(action1);
  const gen2 = handleGasLimitInput(action2);

  it('should put setNonceField with null value when payload is invalid', () => {
    expect(gen1.next().value).toEqual(
      put(
        setGasLimitField({
          raw: payload1,
          value: null
        })
      )
    );
  });

  it('should put setNonceField with Wei value', () => {
    expect(gen2.next().value).toEqual(
      put(
        setGasLimitField({
          raw: payload2,
          value: Wei(payload2)
        })
      )
    );
  });

  itShouldBeDone(gen1);
  itShouldBeDone(gen2);
});

describe('handleNonceInput*', () => {
  const payload = '42';
  const action: any = { payload };
  const validNonce = true;

  const gens: any = {};
  gens.gen = cloneableGenerator(handleNonceInput)(action);

  it('should put call isValidNonce with payload', () => {
    expect(gens.gen.next().value).toEqual(call(isValidNonce, payload));
  });

  it('should put setDataField with null value when data is invalid', () => {
    gens.clone = gens.gen.clone();
    expect(gens.clone.next(!validNonce).value).toEqual(
      put(
        setNonceField({
          raw: payload,
          value: null
        })
      )
    );
  });

  it('should put setDataField with parsed value', () => {
    expect(gens.gen.next(validNonce).value).toEqual(
      put(
        setNonceField({
          raw: payload,
          value: Nonce(payload)
        })
      )
    );
  });

  itShouldBeDone(gens.gen);
});
