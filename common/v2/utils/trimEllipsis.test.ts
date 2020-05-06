import { trimEllipsis } from './trimEllipsis';

const INPUT_STRING_FIXTURE = 'Abcdefg';

describe('TrimEllipsis util', () => {
  it('Should default to empty string', () => {
    expect(trimEllipsis(INPUT_STRING_FIXTURE, -1)).toBe('');
    expect(trimEllipsis(INPUT_STRING_FIXTURE, 0)).toBe('');
    expect(trimEllipsis((undefined as unknown) as string, 1)).toBe('');
    expect(trimEllipsis((undefined as unknown) as string, -1)).toBe('');
  });

  it('Should trim', () => {
    expect(trimEllipsis(INPUT_STRING_FIXTURE, 2)).toBe(INPUT_STRING_FIXTURE.substr(0, 2) + '…');
    expect(trimEllipsis(INPUT_STRING_FIXTURE, INPUT_STRING_FIXTURE.length)).toBe(
      INPUT_STRING_FIXTURE
    );
    expect(trimEllipsis(INPUT_STRING_FIXTURE, INPUT_STRING_FIXTURE.length + 10)).toBe(
      INPUT_STRING_FIXTURE
    );
  });
});
