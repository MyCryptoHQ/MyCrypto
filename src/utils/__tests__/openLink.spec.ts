import { openLink } from '@utils';
import { TURL } from '@types';

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
    expect(window.open).toBeCalledTimes(1);
    expect(window.open).toBeCalledWith(url, '_blank', '_noreferrer');
  });

  it('sets the default target to _blank', () => {
    openLink(url);
    expect(window.open).toBeCalledWith(url, '_blank', '_noreferrer');
  });

  it('accepts a custom target', () => {
    openLink(url, '_self');
    expect(window.open).toBeCalledWith(url, '_self', '_noreferrer');
  });
});
