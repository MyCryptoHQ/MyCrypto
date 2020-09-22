import { renderHook } from '@testing-library/react-hooks';
import toast from 'toasted-notes';

import { ToastTemplates } from './constants';
import { useToasts } from './useToasts';

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
    expect(toast.notify).toHaveBeenCalledWith(expect.anything(), {
      duration: undefined,
      position: 'top-left'
    });
  });
});
