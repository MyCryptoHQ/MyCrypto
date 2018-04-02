import { TypeKeys } from 'actions/transaction';

/* user input */

interface SetCurrentTimeBountyAction {
  type: TypeKeys.CURRENT_TIME_BOUNTY_SET;
  payload: string;
}

type CurrentAction = SetCurrentTimeBountyAction;

export { SetCurrentTimeBountyAction, CurrentAction };
