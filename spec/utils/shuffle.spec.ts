import shuffle from 'utils/shuffle';

describe('shuffle', () => {
  it('should return the entered array if the array is length 0 or length 1', () => {
    const zeroExample: any[] = [];
    const oneExample: number[] = [1];

    expect(shuffle(zeroExample)[0]).toBeUndefined();
    expect(shuffle(oneExample)[0]).toBe(1);
  });

  it('should never return the original array', () => {
    for (let i = 0; i < 10; i++) {
      const exampleArray = [1, 2];
      const shuffledArray = shuffle([...exampleArray]);

      expect(shuffledArray[0]).toBe(2);
    }
  });

  it('should produce an array with a different order each time it is called', () => {
    const exampleArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

    for (let i = 0; i < 10; i++) {
      const shuffledArray = shuffle([...exampleArray]);

      expect(shuffledArray).not.toEqual(exampleArray);
    }
  });
});
