import { TypeKeys } from '../constants';
export { SetCurrentValueAction, SetCurrentToAction, CurrentAction };

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
