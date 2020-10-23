import { TURL } from '@types';
import { openLink } from '@utils';

describe('openLink', () => {
  const { open } = window;
  const url = 'https://example.com' as TURL;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = open;
  });

  it('calls window.open with noreferrer', () => {
    openLink(url);
    expect(window.open).toHaveBeenCalledTimes(1);
    expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noreferrer');
  });

  it('sets the default target to _blank', () => {
    openLink(url);
    expect(window.open).toHaveBeenCalledWith(url, '_blank', 'noreferrer');
  });

  it('accepts a custom target', () => {
    openLink(url, '_self');
    expect(window.open).toHaveBeenCalledWith(url, '_self', 'noreferrer');
  });
});
