import { bufferToHex, toBuffer } from 'ethereumjs-util';
import { TokenValue, Address } from 'libs/units';
import { ITransaction } from '../typings';
import Tx from 'ethereumjs-tx';
import ERC20 from 'libs/erc20';

const enoughTokensViaTx = (t: ITransaction | Tx, tokenBalance: TokenValue | null) => {
  if (!tokenBalance) {
    return true;
  }

  if (!t.data || t.data.length === 0) {
    return false;
    //throw Error('Not enough parameters supplied to validate token balance');
  } else {
    const { _value } = ERC20.transfer.decodeInput(bufferToHex(t.data));
    return tokenBalance.gte(TokenValue(_value));
  }
};

const enoughTokensViaInput = (input: TokenValue | null, tokenBalance: TokenValue | null) => {
  if (!input) {
    return false;
  }
  if (!tokenBalance) {
    return true;
  }
  return input.lte(tokenBalance);
};

const encodeTransfer = (to: Address, value: TokenValue) =>
  toBuffer(ERC20.transfer.encodeInput({ _to: bufferToHex(to), _value: value }));

export { enoughTokensViaTx, encodeTransfer, enoughTokensViaInput };
