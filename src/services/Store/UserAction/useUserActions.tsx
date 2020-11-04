import { useContext } from 'react';

import {
  createUserAction as createUserActionStore,
  destroyUserAction,
  updateUserAction as updateUserActionStore,
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
  const { userActions } = useContext(DataContext);
  const dispatch = useDispatch();

  const createUserAction = (actionTemplate: ActionTemplate) => {
    const userAction: UserAction = {
      name: actionTemplate.name,
      state: ACTION_STATE.NEW
    };
    dispatch(createUserActionStore({ ...userAction, uuid: generateUUID() }));
  };

  const updateUserAction = (_: TUuid, userAction: ExtendedUserAction) =>
    dispatch(updateUserActionStore(userAction));

  const deleteUserAction = (userAction: ExtendedUserAction) =>
    dispatch(destroyUserAction(userAction.uuid));

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
