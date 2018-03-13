import { TypeKeys } from '../constants';

/* user input */

interface SetCurrentWindowStartAction {
  type: TypeKeys.CURRENT_WINDOW_START_SET;
  payload: string;
}

type CurrentAction = SetCurrentWindowStartAction;

export { SetCurrentWindowStartAction, CurrentAction };
