import { Wei } from 'libs/units';
import * as eth from './ether';
import { IFullWallet } from 'libs/wallet';
import { ITransaction } from '../typings';

export const signTransaction = async (
  t: ITransaction,
  w: IFullWallet,
  accountBalance: Wei,
  isOffline: boolean,
  chainId: number
) => {
  eth.validateTx(t, accountBalance, isOffline, chainId);
  const signedT = await eth.signTx(t, w);
  return signedT;
};

export {
  enoughBalanceViaTx,
  validateTx,
  validGasLimit,
  makeTransaction,
  getTransactionFields,
  getTransactionFee,
  computeIndexingHash
} from './ether';
export * from './token';
