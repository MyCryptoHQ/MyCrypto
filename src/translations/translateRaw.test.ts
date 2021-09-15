import { translateRaw } from './translateRaw';

describe('translateRaw', () => {
  it('grabs a translation string from en.json', () => {
    expect(translateRaw('ACTION_8')).toBe('Details');
  });

  it('replaces variables', () => {
    expect(translateRaw('ADDRESS_BOOK_UNDO_REMOVE_OVERLAY_TEXT', { $label: 'foo' })).toBe(
      'Removed address book entry “foo”.'
    );
  });

  it('handles escaping of $', () => {
    expect(translateRaw('ADDRESS_BOOK_UNDO_REMOVE_OVERLAY_TEXT', { $label: '$`' })).toBe(
      'Removed address book entry “$`”.'
    );
  });

  it('handles errors', () => {
    // @ts-expect-error Intentional wrong type
    expect(translateRaw('ADDRESS_BOOK_UNDO_REMOVE_OVERLAY_TEXT', { $label: undefined })).toBe(
      'ADDRESS_BOOK_UNDO_REMOVE_OVERLAY_TEXT'
    );
  });
});
