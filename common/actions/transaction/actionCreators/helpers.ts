import {
  setValueField,
  setDataField,
  createTokenBalanceAction,
  createTokenToAction
} from 'actions/transaction';
import { Dispatch } from 'redux';
import { AppState } from 'reducers';
export {
  clearEther,
  shouldDecimalUpdate,
  isEtherUnit,
  clearTokenFields,
  validNumber
};

const clearEther = (dispatch: Dispatch<AppState>) =>
  dispatch(setValueField({ raw: '', value: null }));

const shouldDecimalUpdate = (prevDecimal: number, newDecimal: number) =>
  prevDecimal !== newDecimal;

const isEtherUnit = (unit: string) => unit === 'ether';

const clearTokenFields = (dispatch: Dispatch<AppState>) => {
  // clear any existing data that might have existed for tokens
  dispatch(setDataField({ raw: '', value: null }));

  // clear token balances
  dispatch(createTokenBalanceAction({ raw: '', value: null }));

  // clear users 'to' address for tokens
  dispatch(createTokenToAction({ raw: '', value: null }));
};

// get rid of this copy paste in 2nd refactor
const validNumber = (num: number) => isFinite(num) && num > 0;
