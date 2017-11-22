import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { Wei, TokenValue } from 'libs/units';
import { ITransaction, ITokenTransaction } from '../typings';
import Tx from 'ethereumjs-tx';

import ERC20 from 'libs/erc20';
export { enoughTokens, makeTxObj, validateTokenBalance, encodeTransfer };

const enoughTokens = (
  t: ITransaction | Tx,
  tokenValue: TokenValue | null,
  tokenBalance: TokenValue
) => {
  let value;
  if ((!t.data || t.data.length === 0) && !tokenValue) {
    return false;
    //throw Error('Not enough parameters supplied to validate token balance');
  }
  if (!t.data || t.data.length === 0) {
    value = tokenValue;
  } else {
    const { _value } = ERC20.transfer.decodeInput(bufferToHex(t.data));
    value = _value;
  }
  return tokenBalance.gte(TokenValue(value));
};

const validateTokenBalance = (t: ITransaction, tokenBalance: TokenValue) => {
  if (!enoughTokens(t, null, tokenBalance)) {
    throw Error('Not enough tokens available');
  }
};
const makeTxObj = (t: ITokenTransaction): ITransaction => {
  const { tokenValue, ...rest } = t;
  const data = encodeTransfer(t.to, tokenValue);
  const value = Wei('0');

  return { ...rest, data, value };
};

const encodeTransfer = (to: Buffer, value: TokenValue) =>
  toBuffer(ERC20.transfer.encodeInput({ _to: to, _value: value }));
