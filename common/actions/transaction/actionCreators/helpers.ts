import {
  setValueField,
  setDataField,
  createTokenBalanceAction
} from 'actions/transaction';
import { Dispatch } from 'redux';
import { AppState } from 'reducers';
export {
  clearEther,
  shouldDecimalUpdate,
  isEtherUnit,
  clearTokenDataAndValue,
  validNumber
};

const clearEther = (dispatch: Dispatch<AppState>) =>
  dispatch(setValueField({ raw: '', value: null }));

const shouldDecimalUpdate = (prevDecimal: number, newDecimal: number) =>
  prevDecimal !== newDecimal;

const isEtherUnit = (unit: string) => unit === 'ether';

const clearTokenDataAndValue = (dispatch: Dispatch<AppState>) => {
  // clear any existing data that might have existed for tokens
  dispatch(setDataField({ raw: '', value: null }));

  // clear token balances
  dispatch(createTokenBalanceAction({ raw: '', value: null }));
};

// get rid of this copy paste in 2nd refactor
const validNumber = (num: number) => isFinite(num) && num > 0;
