import { Wei } from 'libs/units';
import * as eth from './ether';
import { IFullWallet } from 'libs/wallet';
import { ITransaction } from '../typings';

export const signTransaction = async (
  t: ITransaction,
  w: IFullWallet,
  accountBalance: Wei,
  isOffline: boolean
) => {
  eth.validateTx(t, accountBalance, isOffline);
  const signedT = await eth.signTx(t, w);
  return signedT;
};

export {
  enoughBalanceViaTx,
  validateTx,
  validGasLimit,
  makeTransaction,
  getTransactionFields,
  computeIndexingHash
} from './ether';
export * from './token';
