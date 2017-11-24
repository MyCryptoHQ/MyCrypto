import { Wei, TokenValue } from 'libs/units';
import * as eth from './ether';
import * as token from './token';
import { IWallet } from 'libs/wallet';
import { ITokenTransaction, ITransaction } from '../typings';
export { tokenTransaction, signTransaction };
export {
  enoughBalance,
  validateTx,
  validGasLimit,
  transaction,
  getTransactionFields
} from './ether';
export * from './token';

const tokenTransaction = (
  tokenInput: ITokenTransaction,
  tokenBalance: TokenValue
) => {
  const t = token.makeTxObj(tokenInput);
  token.validateTokenBalance(t, tokenBalance);
  return (w: IWallet, accountBalance: Wei, isOffline: boolean) =>
    signTransaction(t, w, accountBalance, isOffline);
};

const signTransaction = async (
  t: ITransaction,
  w: IWallet,
  accountBalance: Wei,
  isOffline: boolean
) => {
  eth.validateTx(t, accountBalance, isOffline);
  const signedT = await eth.signTx(t, w);
  return signedT;
};
