import React from 'react';

import { Provider } from 'react-redux';
import { actionWithPayload, getUseDispatchMock, renderHook } from 'test-utils';

import { fActionTemplates, fUserActions } from '@fixtures';
import { store } from '@store';
import { ACTION_NAME, ACTION_STATE, ExtendedUserAction } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useUserActions from './useUserActions';

const renderUseUserActions = ({ userActions = [] as ExtendedUserAction[] } = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <Provider store={store}>
      <DataContext.Provider value={({ userActions } as any) as IDataContext}>
        {children}
      </DataContext.Provider>
    </Provider>
  );
  return renderHook(() => useUserActions(), { wrapper });
};

describe('useUserActions', () => {
  it('uses get userActions from DataContext', () => {
    const { result } = renderUseUserActions();
    expect(result.current.userActions).toEqual([]);
  });

  it('createUserAction(): dispatch create action with uuid', () => {
    const mockDispatch = getUseDispatchMock();
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

  it('updateUserAction() dispatch update action', () => {
    const mockDispatch = getUseDispatchMock();
    const { result } = renderUseUserActions({ userActions: fUserActions });
    result.current.updateUserAction(fUserActions[0].uuid, fUserActions[0]);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(fUserActions[0]));
  });

  it('deleteUserAction(): dispach destroy action', () => {
    const mockDispatch = getUseDispatchMock();
    const target = fUserActions[0];
    const { result } = renderUseUserActions({ userActions: [target] });

    result.current.deleteUserAction(target);
    expect(mockDispatch).toHaveBeenCalledWith(actionWithPayload(target.uuid));
  });

  it('findUserAction() finds a specific userAction', () => {
    const { result } = renderUseUserActions({ userActions: fUserActions });
    expect(result.current.findUserAction(fUserActions[0].name as ACTION_NAME)).toEqual(
      fUserActions[0]
    );
  });

  it("findUserAction() return undefined when the userAction doesn't exist", () => {
    const { result } = renderUseUserActions({ userActions: fUserActions });
    expect(result.current.findUserAction('foo' as ACTION_NAME)).toBeUndefined();
  });
});
