import shuffle from 'utils/shuffle';

describe('shuffle', () => {
  it('should produce an array with a different order each time it is called', () => {
    const exampleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

    for (let i = 0; i < 10; i++) {
      expect(!shuffle([...exampleArray]).toString()).toEqual(exampleArray.toString());
    }
  });
});
