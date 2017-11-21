import {
  TypeKeys,
  SetUnitMetaAction,
  SetDecimalMetaAction,
  SetTokenValueMetaAction,
  setDataField,
  setValueField
} from 'actions/transaction';
import { ThunkAction } from 'redux-thunk';
import { AppState } from 'reducers';
import { toTokenBase, fromTokenBase } from 'libs/units';
import { bufferToHex } from 'ethereumjs-util';
import { encodeTransfer } from 'libs/transaction/utils/token';
import {
  shouldUnitUpdate,
  isEtherUnit,
  clearTokenData,
  clearEther,
  shouldDecimalUpdate
} from 'actions/transaction/actionCreators/helpers';
export {
  TSetDecimalMeta,
  TSetUnitMeta,
  TSetTokenBalance,
  setUnitMeta,
  setDecimalMeta,
  setTokenBalance,
  createTokenBalanceAction
};

type TSetTokenBalance = typeof setTokenBalance;
type TSetUnitMeta = typeof setUnitMeta;
type TSetDecimalMeta = typeof setDecimalMeta;

const createTokenBalanceAction = (
  payload: SetTokenValueMetaAction['payload']
): SetTokenValueMetaAction => ({
  type: TypeKeys.TOKEN_VALUE_META_SET,
  payload
});

const setTokenBalance = (
  payload: SetTokenValueMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction: { fields: { to } } } = getState();

  if (to.value && payload.value) {
    // we'll need to update the data field for the new balance
    const data = encodeTransfer(to.value, payload.value);
    dispatch(setDataField({ raw: bufferToHex(data), value: data }));
  }

  return dispatch(createTokenBalanceAction(payload));
};

const createUnitAction = (
  payload: SetUnitMetaAction['payload']
): SetUnitMetaAction => ({
  type: TypeKeys.UNIT_META_SET,
  payload
});

/**
 * @description When setting the unit, if its a token then handle the contract data, if it changes to eth
 * then clear the data field.
 * @param payload
 */
const setUnitMeta = (
  payload: SetUnitMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction } = getState();
  const { meta: { unit }, fields: { to, value: { value } } } = transaction;
  const address = to.value;

  if (!shouldUnitUpdate(unit, payload)) {
    return;
  }

  if (isEtherUnit(payload)) {
    // if switching to ether, clear token data
    clearTokenData(dispatch);
  } else {
    // else if switching to tokens and the required values exist, encode it
    if (address && value) {
      // set the data to the encoded value
      const data = encodeTransfer(address, value);
      dispatch(setDataField({ raw: bufferToHex(data), value: data }));
    }

    //clear ether value
    clearEther(dispatch);
  }

  return dispatch(createUnitAction(payload));
};

const createDecimalAction = (
  payload: SetDecimalMetaAction['payload']
): SetDecimalMetaAction => ({
  type: TypeKeys.DECIMAL_META_SET,
  payload
});

/**
 *  When decimal is set, check if its different than the currently set decimal,
 *  if so, set the balance to the correct decimal
 * @param payload
 */
const setDecimalMeta = (
  payload: SetDecimalMetaAction['payload']
): ThunkAction<any, AppState, null> => (dispatch, getState) => {
  const { transaction } = getState();
  const {
    meta: { decimal, tokenValue, unit },
    fields: { value: balance }
  } = transaction;

  if (!shouldDecimalUpdate(decimal, payload)) {
    return;
  }

  if (balance.value && tokenValue.value) {
    // we have a conflict between ether or token balance
    if (isEtherUnit(unit)) {
      clearTokenData(dispatch);
    } else {
      clearEther(dispatch);
    }
  }
  if (isEtherUnit(unit)) {
    if (balance.value) {
      const newBalance = toTokenBase(
        fromTokenBase(balance.value, decimal),
        payload
      );
      dispatch(setValueField({ raw: balance.raw, value: newBalance }));
    }
  } else if (tokenValue.value) {
    const newBalance = toTokenBase(
      fromTokenBase(tokenValue.value, decimal),
      payload
    );
    dispatch(
      createTokenBalanceAction({ raw: tokenValue.raw, value: newBalance })
    );
  }

  return dispatch(createDecimalAction(payload));
};
