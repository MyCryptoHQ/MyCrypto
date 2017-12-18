import * as interfaces from './actionTypes';
import { TypeKeys } from './constants';

export type TStartOnboardSession = typeof startOnboardSession;
export function startOnboardSession(): interfaces.StartOnboardSessionAction {
  return {
    type: TypeKeys.START_ONBOARD_SESSION
  };
}
