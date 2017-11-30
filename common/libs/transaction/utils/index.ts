import { Wei } from 'libs/units';
import * as eth from './ether';
import { IWallet } from 'libs/wallet';
import { ITransaction } from '../typings';
export { signTransaction };
export {
  enoughBalance,
  validateTx,
  validGasLimit,
  transaction,
  getTransactionFields,
  computeIndexingHash
} from './ether';
export * from './token';
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
