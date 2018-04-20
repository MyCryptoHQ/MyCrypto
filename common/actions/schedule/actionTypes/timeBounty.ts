import { TypeKeys } from 'actions/schedule';

/* user input */

interface SetCurrentTimeBountyAction {
  type: TypeKeys.CURRENT_TIME_BOUNTY_SET;
  payload: string;
}

type CurrentAction = SetCurrentTimeBountyAction;

export { SetCurrentTimeBountyAction, CurrentAction };
