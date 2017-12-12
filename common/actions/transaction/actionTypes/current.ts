import { TypeKeys } from '../constants';

/* user input */

interface SetCurrentValueAction {
  type: TypeKeys.CURRENT_VALUE_SET;
  payload: string;
}

interface SetCurrentToAction {
  type: TypeKeys.CURRENT_TO_SET;
  payload: string;
}

type CurrentAction = SetCurrentValueAction | SetCurrentToAction;

export { SetCurrentValueAction, SetCurrentToAction, CurrentAction };
