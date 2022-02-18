import { RefObject } from 'react';

import { waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import QrScanner from 'qr-scanner';

import { useScanner } from './useScanner';

jest.mock('qr-scanner');

describe('useScanner', () => {
  it('initialises the scanner', async () => {
    const start = jest.fn().mockResolvedValue(undefined);
    const destroy = jest.fn();
    const mock = QrScanner as jest.MockedClass<typeof QrScanner>;

    mock.mockImplementation(
      () =>
        (({
          start,
          destroy
        } as unknown) as QrScanner)
    );

    const ref = {
      current: {}
    } as RefObject<HTMLVideoElement>;

    const { result, unmount } = renderHook(() => useScanner(ref, jest.fn()));
    expect(result.current.isLoading).toBe(true);

    // Triggers an update
    await waitFor(() => undefined);

    expect(result.current.isLoading).toBe(false);
    expect(start).toHaveBeenCalledTimes(1);

    unmount();

    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('returns errors', async () => {
    const start = jest.fn().mockRejectedValue('foo');
    const destroy = jest.fn();
    const mock = QrScanner as jest.MockedClass<typeof QrScanner>;

    mock.mockImplementation(
      () =>
        (({
          start,
          destroy
        } as unknown) as QrScanner)
    );

    const ref = {
      current: {}
    } as RefObject<HTMLVideoElement>;

    const { result } = renderHook(() => useScanner(ref, jest.fn()));
    expect(result.current.isLoading).toBe(true);

    // Triggers an update
    await waitFor(() => undefined);

    expect(result.current.error).toBe('foo');
  });
});
