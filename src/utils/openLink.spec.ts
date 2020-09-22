import { TURL } from '@types';
import { openLink } from '@utils';

describe('opneLink', () => {
  const { open } = window;
  const url = 'https://example.com' as TURL;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = open;
  });

  it('calls window.open with _noreferrer', () => {
    openLink(url);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(url, '_blank', '_noreferrer');
  });

  it('sets the default target to _blank', () => {
    openLink(url);
    expect(window.open).toHaveBeenCalledWith(url, '_blank', '_noreferrer');
  });

  it('accepts a custom target', () => {
    openLink(url, '_self');
    expect(window.open).toHaveBeenCalledWith(url, '_self', '_noreferrer');
  });
});
