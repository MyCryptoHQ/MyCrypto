import { useContext } from 'react';

import { ActionTemplate, ExtendedUserAction, LSKeys, TUuid, UserAction } from '@types';
import { generateUUID } from '@utils';

import { DataContext } from '../DataManager';

export interface IUserActionContext {
  userActions: UserAction[];
  createUserAction(actionTemplate: UserAction): void;
  updateUserAction(uuid: TUuid, userAction: ExtendedUserAction): void;
  deleteUserAction(userAction: ExtendedUserAction): void;
}

function useUserActions() {
  const { createActions, userActions } = useContext(DataContext);
  const model = createActions(LSKeys.USER_ACTIONS);

  const createUserAction = (actionTemplate: ActionTemplate) => {
    const userAction: UserAction = {
      name: actionTemplate.name,
      state: 'new'
    };
    model.create({ ...userAction, uuid: generateUUID() });
  };

  const updateUserAction = (uuid: TUuid, userAction: ExtendedUserAction) =>
    model.update(uuid, userAction);

  const deleteUserAction = (userAction: ExtendedUserAction) => model.destroy(userAction);

  return {
    userActions,
    createUserAction,
    updateUserAction,
    deleteUserAction
  };
}

export default useUserActions;
