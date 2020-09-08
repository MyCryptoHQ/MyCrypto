import { renderHook } from '@testing-library/react-hooks';
import toast from 'toasted-notes';

import { useToasts } from './useToasts';
import { ToastTemplates } from './constants';

const renderUseToasts = () => {
  return renderHook(() => useToasts());
};

jest.mock('toasted-notes');

describe('useToasts', () => {
  it('has the correct Toast Templates', () => {
    const { result } = renderUseToasts();
    expect(result.current.toastTemplates).toBe(ToastTemplates);
  });

  it('calls toasted-notes to display toast', () => {
    const { result } = renderUseToasts();
    result.current.displayToast(ToastTemplates.addedAddress);
    expect(toast.notify).toBeCalledWith(expect.anything(), {
      duration: undefined,
      position: 'top-left'
    });
  });
});
