import Tx from 'ethereumjs-tx';
import { bufferToHex } from 'ethereumjs-util';
import { Wei } from 'libs/units';
import { isValidETHAddress } from 'libs/validators';
import { IWallet } from 'libs/wallet';
import { translateRaw } from 'translations';
import { ITransaction } from '../typings';
export {
  generateTx,
  validAddress,
  validGasLimit,
  enoughBalance,
  gasParamsInRange,
  validateTx
};

/**
 * @description Return the minimum amount of ether needed
 * @param t
 */
const enoughBalance = (t: ITransaction, accountBalance: Wei) =>
  new Tx(t).getUpfrontCost().gte(accountBalance);

/**
 * @description Return the minimum amount of gas needed (for gas limit validation)
 * @param t
 */
const validGasLimit = (t: ITransaction) =>
  new Tx(t).getBaseFee().gte(t.gasLimit);

/**
 * @description Check that gas limits and prices are within valid ranges
 * @param t
 */
const gasParamsInRange = (t: ITransaction) => {
  if (t.gasLimit.ltn(21000)) {
    throw Error('Gas limit must be at least 21000 for transactions');
  }
  if (t.gasLimit.gtn(5000000)) {
    throw Error(translateRaw('GETH_GasLimit'));
  }
  if (t.gasPrice.gt(Wei('1000000000000'))) {
    throw Error(
      'Gas price too high. Please contact support if this was not a mistake.'
    );
  }
};

const validAddress = (t: ITransaction) => {
  if (!isValidETHAddress(bufferToHex(t.to))) {
    throw Error(translateRaw('ERROR_5'));
  }
};

//TODO: check that addresses are always checksummed
const generateTx = async (t: ITransaction, w: IWallet) => {
  const tx = new Tx(t);
  const signedTx = await w.signRawTransaction(tx); //returns a serialized, signed tx
  return signedTx; //instead of returning the rawTx with it, we can derive it from the signedTx anyway
};

const validateTx = (
  t: ITransaction,
  accountBalance: Wei,
  isOffline: boolean
) => {
  gasParamsInRange(t);
  if (!isOffline && !validGasLimit(t)) {
    throw Error('Not enough gas supplied');
  }
  if (!enoughBalance(t, accountBalance)) {
    throw Error(translateRaw('GETH_Balance'));
  }
  validAddress(t);
};
