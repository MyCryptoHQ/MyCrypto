import { SetCurrentWindowSizeAction } from '../actionTypes/windowSize';
import { TypeKeys } from 'actions/schedule';

type TSetCurrentWindowSize = typeof setCurrentWindowSize;
const setCurrentWindowSize = (
  payload: SetCurrentWindowSizeAction['payload']
): SetCurrentWindowSizeAction => ({
  type: TypeKeys.CURRENT_WINDOW_SIZE_SET,
  payload
});

export { setCurrentWindowSize, TSetCurrentWindowSize };
