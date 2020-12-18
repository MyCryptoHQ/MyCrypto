import { useContext } from 'react';

import {
  createUserAction as createAUserAction,
  destroyUserAction,
  updateUserAction as updateAUserAction,
  useDispatch
} from '@store';
import {
  ACTION_NAME,
  ACTION_STATE,
  ActionTemplate,
  ExtendedUserAction,
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
  const dispatch = useDispatch();
  const { userActions } = useContext(DataContext);

  const createUserAction = (actionTemplate: ActionTemplate) => {
    const userAction: UserAction = {
      name: actionTemplate.name,
      state: ACTION_STATE.NEW
    };
    dispatch(createAUserAction({ ...userAction, uuid: generateUUID() }));
  };

  const updateUserAction = (uuid: TUuid, userAction: ExtendedUserAction) =>
    dispatch(updateAUserAction({ ...userAction, uuid }));

  const deleteUserAction = (userAction: ExtendedUserAction) => {
    dispatch(destroyUserAction(userAction.uuid));
  };

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
