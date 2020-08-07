import { sortByLabel } from './sort';

describe('sortByLabel()', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(sortByLabel([])).toEqual([]);
  });

  it('throws an error when array element is missing a label prop', () => {
    const test = [{ without: 'nothing' }, { without: 'nothing2' }];
    expect(() => sortByLabel(test)).toThrow(TypeError);
  });

  it('sorts labels alphabetically', () => {
    const test = [{ label: 'bob' }, { label: 'alice' }];
    expect(sortByLabel(test)[0]).toEqual(test[1]);
  });

  it('sorts case insensitive', () => {
    const test = [{ label: 'bob' }, { label: 'charlie' }, { label: 'alice' }, { label: 'Alice' }];
    // 'alice' comes before 'Alice'
    expect(sortByLabel(test)[1].label).toEqual(test[3].label);
  });
});
