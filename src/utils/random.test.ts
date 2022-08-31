import { randomElementFromArray } from './random';

describe('randomElementFromArray', () => {
  // ensure that Math.random() returns a predictable value
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.31511876277286466);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  });

  const array = ['foo', 'bar', 'baz', 'qux'];

  it('select index 1 of the array and returns it', () => {
    const result = randomElementFromArray(array);

    expect(result).toEqual(array[1]);
  });

  it('calls Math.random()', () => {
    randomElementFromArray(array);

    expect(Math.random).toHaveBeenCalled();
  });
});
