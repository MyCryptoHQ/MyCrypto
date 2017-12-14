import { select, call, put } from 'redux-saga/effects';
import { setDataField } from 'actions/transaction';
import { encodeTransfer } from 'libs/transaction/utils/token';
import { getTokenValue } from 'selectors/transaction/meta';
import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { getTokenTo, getData } from 'selectors/transaction';
import { handleTokenTo, handleTokenValue } from 'sagas/transaction/meta/token';
import { cloneableGenerator } from 'redux-saga/utils';

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
  const data: any = toBuffer('0x0a');
  const prevData: any = {
    raw: '0x0b'
  };

  const gens: any = {};
  gens.gen = cloneableGenerator(handleTokenValue)(action);

  it('should select getTokenTo', () => {
    expect(gens.gen.next().value).toEqual(select(getTokenTo));
  });

  it('should select getData', () => {
    gens.clone1 = gens.gen.clone();
    expect(gens.gen.next(tokenTo).value).toEqual(select(getData));
  });

  it('should return if !tokenTo.value', () => {
    gens.clone1.next({ value: false });
    expect(gens.clone1.next().done).toEqual(true);
  });

  it('should call encodeTransfer', () => {
    expect(gens.gen.next(prevData).value).toEqual(
      call(encodeTransfer, tokenTo.value, action.payload.value)
    );
  });

  it('should put setDataField', () => {
    gens.clone2 = gens.gen.clone();
    expect(gens.gen.next(data).value).toEqual(
      put(setDataField({ raw: bufferToHex(data), value: data }))
    );
  });

  it('should return if prevData is equal to data', () => {
    const sameData = toBuffer('0xb');
    expect(gens.clone2.next(sameData).done).toEqual(true);
  });

  itShouldBeDone(gens.gen);
});
