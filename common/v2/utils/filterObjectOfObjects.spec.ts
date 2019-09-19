import { filterObjectOfObjects } from './filterObjectOfObjects';

describe('it runs', () => {
  const object = {
    A: {
      isDeterministic: true,
      isSecure: false,
      type: 'hardware'
    },
    B: {
      isDeterministic: true,
      isSecure: true,
      type: 'legacy'
    }
  };

  it('finds all objects with a valid attribute', () => {
    const filtered = filterObjectOfObjects(object)('isDeterministic');
    expect(filtered).toEqual(object);
  });

  it('returns a new object with the valid attributes', () => {
    const filtered = filterObjectOfObjects(object)('isSecure');
    expect(filtered).toEqual({ B: object.B });
  });

  it('accepts a predicate', () => {
    const filtered = filterObjectOfObjects(object)((val: any) => val.type === 'hardware');
    expect(filtered).toEqual({ A: object.A });
  });
});
