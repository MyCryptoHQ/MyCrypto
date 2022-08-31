import { toArray } from './toArray';

describe('toArray', () => {
  it("converts an object's string values to an array of values", () => {
    const actual = toArray({
      keyOne: 'one',
      keyTwo: 'two',
      keyThree: 'three'
    });
    expect(actual).toStrictEqual(['one', 'two', 'three']);
  });

  it("converts an object's nested object values to an array of values", () => {
    const actual = toArray({
      keyOne: {
        keyOneOne: 'one'
      },
      keyTwo: {
        keyTwoOne: 'two'
      },
      keyThree: {
        keyTwoOne: 'two'
      }
    });
    expect(actual).toStrictEqual([
      {
        keyOneOne: 'one'
      },
      {
        keyTwoOne: 'two'
      },
      {
        keyTwoOne: 'two'
      }
    ]);
  });
});
