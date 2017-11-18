import {
  loadState,
  saveState,
  loadStatePropertyOrEmptyObject,
  REDUX_STATE
} from '../../common/utils/localStorage';

describe('saveState', () => {
  it('should serialize and persist state to local storage under key: "REDUX_STATE"', () => {
    const persistMe = {
      foo: 'bar'
    };
    saveState(persistMe);
    expect(JSON.parse(localStorage.getItem(REDUX_STATE) as string)).toEqual(
      persistMe
    );
  });
});

describe('loadStage', () => {
  it('should return local storage under KEY: "REDUX_STATE"', () => {
    const exValue = 'foo';
    localStorage.setItem(REDUX_STATE, JSON.stringify(exValue));
    expect(loadState()).toEqual(exValue);
  });
});

describe('loadStatePropertyOrEmptyObject', () => {
  it('should return property of object from local storage under KEY: "REDUX_STATE"', () => {
    const serializeThis = {
      one: 'foo',
      two: 'bar'
    };
    saveState(serializeThis);
    expect(loadStatePropertyOrEmptyObject('one')).toEqual(serializeThis.one);
  });
});
