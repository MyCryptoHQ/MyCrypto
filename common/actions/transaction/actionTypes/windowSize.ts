import { TypeKeys } from '../constants';

/* user input */

interface SetCurrentWindowSizeAction {
  type: TypeKeys.CURRENT_WINDOW_SIZE_SET;
  payload: string;
}

type CurrentAction = SetCurrentWindowSizeAction;

export { SetCurrentWindowSizeAction, CurrentAction };
