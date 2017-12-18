import { SetCurrentToAction, SetCurrentValueAction } from '../actionTypes/current';
import { TypeKeys } from '../';

type TSetCurrentValue = typeof setCurrentValue;
const setCurrentValue = (payload: SetCurrentValueAction['payload']): SetCurrentValueAction => ({
  type: TypeKeys.CURRENT_VALUE_SET,
  payload
});

type TSetCurrentTo = typeof setCurrentTo;
const setCurrentTo = (payload: SetCurrentToAction['payload']): SetCurrentToAction => ({
  type: TypeKeys.CURRENT_TO_SET,
  payload
});

export { setCurrentValue, setCurrentTo, TSetCurrentTo, TSetCurrentValue };
