import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { Wei, TokenValue } from 'libs/units';
import { ITransaction, ITokenTransaction } from '../typings';
import ERC20 from 'libs/erc20';
export { enoughTokens, makeTxObj, validateTokenBalance, encodeTransfer };

const enoughTokens = (t: ITransaction, tokenBalance: TokenValue) => {
  const { _value: value } = ERC20.transfer.decodeInput(bufferToHex(t.data!));
  return tokenBalance.gte(TokenValue(value));
};

const validateTokenBalance = (t: ITransaction, tokenBalance: TokenValue) => {
  if (!enoughTokens(t, tokenBalance)) {
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
