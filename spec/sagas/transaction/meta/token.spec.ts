import { select, call, put, takeEvery } from 'redux-saga/effects';
import { SagaIterator } from 'redux-saga';
import {
  SetTokenToMetaAction,
  setDataField,
  SetTokenValueMetaAction,
  TypeKeys
} from 'actions/transaction';
import { encodeTransfer } from 'libs/transaction/utils/token';
import { getTokenValue } from 'selectors/transaction/meta';
import { AppState } from 'reducers';
import { bufferToHex } from 'ethereumjs-util';
import { getTokenTo } from 'selectors/transaction';

import { handleTokenTo, handleTokenValue } from 'sagas/transaction/meta/token';
import { cloneableGenerator } from 'redux-saga/utils';

/* tslint:disable */
// import 'selectors/transaction'; //throws if not imported
/* tslint:enable */

const itShouldBeDone = gen => {
  it('should be done', () => {
    expect(gen.next().done).toEqual(true);
  });
};

describe('handleTokenTo*', () => {
  const action: any = {
    payload: {
      value: 'value1'
    }
  };
  const tokenValue: any = {
    value: 'value2'
  };
  const data: any = 'data';

  const gens: any = {};
  gens.gen = cloneableGenerator(handleTokenTo)(action);

  it('should select getTokenValue', () => {
    expect(gens.gen.next().value).toEqual(select(getTokenValue));
  });

  it('should return if !tokenValue.value', () => {
    gens.clone1 = gens.gen.clone();
    expect(gens.clone1.next({ value: false }).done).toEqual(true);
  });

  it('should call encodeTransfer', () => {
    expect(gens.gen.next(tokenValue).value).toEqual(
      call(encodeTransfer, action.payload.value, tokenValue.value)
    );
  });

  it('should put setDataField', () => {
    expect(gens.gen.next(data).value).toEqual(
      put(
        setDataField({
          raw: bufferToHex(data),
          value: data
        })
      )
    );
  });

  itShouldBeDone(gens.gen);
});

describe('handleTokenValue*', () => {
  const action: any = {
    payload: {
      value: 'value1'
    }
  };
  const tokenTo: any = {
    value: 'value2'
  };
  const data: any = 'data';

  const gens: any = {};
  gens.gen = cloneableGenerator(handleTokenValue)(action);

  it('should select getTokenTo', () => {
    expect(gens.gen.next().value).toEqual(select(getTokenTo));
  });

  it('should return if !tokenTo.value', () => {
    const clone1 = gens.gen.clone();
    expect(clone1.next({ value: false }).done).toEqual(true);
  });

  it('should call encodeTransfer', () => {
    expect(gens.gen.next(tokenTo).value).toEqual(
      call(encodeTransfer, tokenTo.value, action.payload.value)
    );
  });

  it('should put setDataField', () => {
    expect(gens.gen.next(data).value).toEqual(
      put(setDataField({ raw: bufferToHex(data), value: data }))
    );
  });

  itShouldBeDone(gens.gen);
});
