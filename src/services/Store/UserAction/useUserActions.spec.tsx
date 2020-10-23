import React from 'react';

import { renderHook } from '@testing-library/react-hooks';

import { fActionTemplates, fUserActions } from '@fixtures';
import { ACTION_NAME, ACTION_STATE, ExtendedUserAction, LSKeys } from '@types';

import { DataContext, IDataContext } from '../DataManager';
import useUserActions from './useUserActions';

const renderUseUserActions = ({
  userActions = [] as ExtendedUserAction[],
  createActions = jest.fn()
} = {}) => {
  const wrapper: React.FC = ({ children }) => (
    <DataContext.Provider value={({ userActions, createActions } as any) as IDataContext}>
      {' '}
      {children}
    </DataContext.Provider>
  );
  return renderHook(() => useUserActions(), { wrapper });
};

describe('useUserActions', () => {
  it('uses get userActions from DataContext', () => {
    const { result } = renderUseUserActions();
    expect(result.current.userActions).toEqual([]);
  });

  it('uses a valid data model', () => {
    const createActions = jest.fn();
    renderUseUserActions({ createActions });
    expect(createActions).toHaveBeenCalledWith(LSKeys.USER_ACTIONS);
  });

  it('createUserAction(): adds the uuid and calls create()', () => {
    const createActions = jest.fn().mockReturnValue({
      create: jest.fn()
    });
    const { result } = renderUseUserActions({ createActions });

    result.current.createUserAction(fActionTemplates[0]);

    expect(createActions().create).toHaveBeenCalledWith({
      name: fActionTemplates[0].name,
      state: ACTION_STATE.NEW,
      uuid: expect.any(String)
    });
  });

  it('updateUserAction() calls model.update', () => {
    const mockUpdate = jest.fn();
    const { result } = renderUseUserActions({
      userActions: fUserActions,
      createActions: jest.fn(() => ({ update: mockUpdate }))
    });
    result.current.updateUserAction(fUserActions[0].uuid, fUserActions[0]);
    expect(mockUpdate).toHaveBeenCalledWith(fUserActions[0].uuid, fUserActions[0]);
  });

  it('deleteUserAction(): calls destroy() with the target action', () => {
    const createActions = jest.fn().mockReturnValue({
      destroy: jest.fn()
    });
    const target = fUserActions[0];
    const { result } = renderUseUserActions({ userActions: [target], createActions });

    result.current.deleteUserAction(target);
    expect(createActions().destroy).toHaveBeenCalledWith(target);
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
