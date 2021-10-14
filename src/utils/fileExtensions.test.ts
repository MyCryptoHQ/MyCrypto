import { detectMediaType, getFileExtension, MediaType } from './fileExtensions';

describe('getFileExtension', () => {
  it('finds file extensions in path', () => {
    const url = new URL('https://storage.opensea.io/files/09e5af38415a3cad64b866c800dd6f5d.svg');
    expect(getFileExtension(url.pathname)).toBe('svg');
  });

  it('returns undefined if no file extension found', () => {
    const url = new URL(
      'https://lh3.googleusercontent.com/3-WLskej5iAKXLuaxGh6f_zb7H5djrDNLJOnD-qmfdoHpeX_QE4aEmbe2-ZADjN1geqGWxqKMqb7hdbih6-aMt5P2EllJfF-EJV3oXw=s250'
    );
    expect(getFileExtension(url.pathname)).toBeUndefined();
  });
});

describe('detectMediaType', () => {
  it('detects image', () => {
    const url = new URL('https://storage.opensea.io/files/09e5af38415a3cad64b866c800dd6f5d.svg');
    expect(detectMediaType(url.pathname)).toBe(MediaType.Image);
  });

  it('detects video', () => {
    const url = new URL('https://storage.opensea.io/files/09e5af38415a3cad64b866c800dd6f5d.mov');
    expect(detectMediaType(url.pathname)).toBe(MediaType.Video);
  });

  it('detects audio', () => {
    const url = new URL('https://storage.opensea.io/files/09e5af38415a3cad64b866c800dd6f5d.ogg');
    expect(detectMediaType(url.pathname)).toBe(MediaType.Audio);
  });

  it('defaults to Image', () => {
    const url = new URL(
      'https://lh3.googleusercontent.com/3-WLskej5iAKXLuaxGh6f_zb7H5djrDNLJOnD-qmfdoHpeX_QE4aEmbe2-ZADjN1geqGWxqKMqb7hdbih6-aMt5P2EllJfF-EJV3oXw=s250'
    );
    expect(detectMediaType(url.pathname)).toBe(MediaType.Image);
  });
});
