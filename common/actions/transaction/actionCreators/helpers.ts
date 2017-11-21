import {
  setValueField,
  setDataField,
  createTokenBalanceAction
} from 'actions/transaction';
import { Dispatch } from 'redux';
import { AppState } from 'reducers';
export {
  clearEther,
  shouldUnitUpdate,
  shouldDecimalUpdate,
  isEtherUnit,
  clearTokenData
};

const clearEther = (dispatch: Dispatch<AppState>) =>
  dispatch(setValueField({ raw: '', value: null }));

const shouldUnitUpdate = (prevUnit: string, newUnit: string) =>
  prevUnit !== newUnit;

const shouldDecimalUpdate = (prevDecimal: number, newDecimal: number) =>
  prevDecimal !== newDecimal;

const isEtherUnit = (unit: string) => unit === 'ether';

const clearTokenData = (dispatch: Dispatch<AppState>) => {
  // clear any existing data that might have existed for tokens
  dispatch(setDataField({ raw: '', value: null }));

  // clear token balances
  dispatch(createTokenBalanceAction({ raw: '', value: null }));
};
