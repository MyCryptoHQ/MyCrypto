import { useContext } from 'react';

import {
  ACTION_NAME,
  ACTION_STATE,
  ActionTemplate,
  ExtendedUserAction,
  LSKeys,
  TUuid,
  UserAction
} from '@types';
import { generateUUID } from '@utils';

import { DataContext } from '../DataManager';

export interface IUserActionContext {
  userActions: UserAction[];
  createUserAction(actionTemplate: UserAction): void;
  updateUserAction(uuid: TUuid, userAction: ExtendedUserAction): void;
  deleteUserAction(userAction: ExtendedUserAction): void;
  findUserAction(actionName: string): ExtendedUserAction | undefined;
}

function useUserActions() {
  const { createActions, userActions } = useContext(DataContext);
  const model = createActions(LSKeys.USER_ACTIONS);

  const createUserAction = (actionTemplate: ActionTemplate) => {
    const userAction: UserAction = {
      name: actionTemplate.name,
      state: ACTION_STATE.NEW
    };
    model.create({ ...userAction, uuid: generateUUID() });
  };

  const updateUserAction = (uuid: TUuid, userAction: ExtendedUserAction) =>
    model.update(uuid, userAction);

  const deleteUserAction = (userAction: ExtendedUserAction) => model.destroy(userAction);

  const findUserAction = (actionName: ACTION_NAME): ExtendedUserAction | undefined =>
    userActions.find((a) => a.name === actionName);

  return {
    userActions,
    createUserAction,
    updateUserAction,
    deleteUserAction,
    findUserAction
  };
}

export default useUserActions;
