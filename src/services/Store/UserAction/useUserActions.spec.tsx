import { FC } from 'react';

import { renderHook } from '@testing-library/react-hooks';
import { actionWithPayload, mockAppState, mockUseDispatch, ProvidersWrapper } from 'test-utils';

import { fActionTemplates, fUserActions } from '@fixtures';
import { ACTION_NAME, ACTION_STATE, ExtendedUserAction } from '@types';

import useUserActions from './useUserActions';

const renderUseUserActions = ({ userActions = [] as ExtendedUserAction[] } = {}) => {
  const wrapper: FC = ({ children }) => (
    <ProvidersWrapper initialState={mockAppState({ userActions })}>{children}</ProvidersWrapper>
  );
  return renderHook(() => useUserActions(), { wrapper });
};

describe('useUserActions', () => {
  it('uses get userActions from store', () => {
    const { result } = renderUseUserActions();
    expect(result.current.userActions).toEqual([]);
  });

  it('createUserAction(): adds the uuid and calls create()', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseUserActions();

    result.current.createUserAction(fActionTemplates[0]);

    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        name: fActionTemplates[0].name,
        state: ACTION_STATE.NEW,
        uuid: expect.any(String)
      })
    );
  });

  it('updateUserAction() dispatches action', () => {
    const mockDispatch = mockUseDispatch();
    const { result } = renderUseUserActions({
      userActions: fUserActions
    });
    result.current.updateUserAction(fUserActions[0].uuid, fUserActions[0]);
    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({ ...fUserActions[0], uuid: fUserActions[0].uuid })
    );
  });

  it('deleteUserAction(): calls destroy() with the target action', () => {
    const mockDispatch = mockUseDispatch();
    const target = fUserActions[0];
    const { result } = renderUseUserActions({ userActions: [target] });

    result.current.deleteUserAction(target);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(target.uuid));
  });

  it('findUserAction() finds a specific userAction', () => {
    const { result } = renderUseUserActions({
      userActions: fUserActions
    });

    expect(result.current.findUserAction(fUserActions[0].name as ACTION_NAME)).toEqual(
      fUserActions[0]
    );
  });

  it("findUserAction() return undefined when the userAction doesn't exist", () => {
    const { result } = renderUseUserActions({
      userActions: fUserActions
    });

    expect(result.current.findUserAction('foo' as ACTION_NAME)).toBeUndefined();
  });
});
