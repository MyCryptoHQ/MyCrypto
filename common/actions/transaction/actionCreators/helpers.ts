import {
  setValueField,
  setDataField,
  createTokenBalanceAction,
  createTokenToAction
} from 'actions/transaction';
import { Dispatch } from 'redux';
import { AppState } from 'reducers';
export { isEtherUnit, validNumber };

const isEtherUnit = (unit: string) => unit === 'ether';

// get rid of this copy paste in 2nd refactor
const validNumber = (num: number) => isFinite(num) && num > 0;
