import Tx from 'ethereumjs-tx';
import { bufferToHex } from 'ethereumjs-util';
import { Wei } from 'libs/units';
import { isValidETHAddress } from 'libs/validators';
import { IFullWallet } from 'libs/wallet';
import { translateRaw } from 'translations';
import { ITransaction, IHexStrTransaction } from '../typings';
import { hexEncodeQuantity, hexEncodeData } from 'libs/nodes/rpc/utils';

// we dont include the signature paramaters because web3 transactions are unsigned
const computeIndexingHash = (tx: Buffer) => bufferToHex(makeTransaction(tx).hash(false));

// Get useable fields from an EthTx object.
const getTransactionFields = (t: Tx): IHexStrTransaction => {
  // For some crazy reason, toJSON spits out an array, not keyed values.
  const { data, gasLimit, gasPrice, to, nonce, value } = t;

  const chainId = t.getChainId();

  return {
    value: hexEncodeQuantity(value),
    data: hexEncodeData(data),
    // To address is unchecksummed, which could cause mismatches in comparisons
    to: hexEncodeData(to),
    // Everything else is as-is
    nonce: hexEncodeQuantity(nonce),
    gasPrice: hexEncodeQuantity(gasPrice),
    gasLimit: hexEncodeQuantity(gasLimit),
    chainId
  };
};

/**
 * @description Return the minimum amount of ether needed
 * @param t
 */
const enoughBalanceViaTx = (t: Tx | ITransaction, accountBalance: Wei) =>
  makeTransaction(t)
    .getUpfrontCost()
    .lte(accountBalance);

/**
 * @description Return the minimum amount of gas needed (for gas limit validation)
 * @param t
 */
const validGasLimit = (t: ITransaction) =>
  makeTransaction(t)
    .getBaseFee()
    .lte(t.gasLimit);

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
    throw Error('Gas price too high. Please contact support if this was not a mistake.');
  }
};

const validAddress = (t: ITransaction) => {
  if (!isValidETHAddress(bufferToHex(t.to))) {
    throw Error(translateRaw('ERROR_5'));
  }
};

const makeTransaction = (
  t: Partial<Tx> | Partial<ITransaction> | Partial<IHexStrTransaction> | Buffer | string
) => new Tx(t);

//TODO: check that addresses are always checksummed
const signTx = async (t: ITransaction, w: IFullWallet) => {
  const tx = makeTransaction(t);
  const signedTx = await w.signRawTransaction(tx); //returns a serialized, signed tx
  return signedTx; //instead of returning the rawTx with it, we can derive it from the signedTx anyway
};

const validateTx = (t: ITransaction, accountBalance: Wei, isOffline: boolean) => {
  gasParamsInRange(t);
  if (!isOffline && !validGasLimit(t)) {
    throw Error('Not enough gas supplied');
  }
  if (!enoughBalanceViaTx(t, accountBalance)) {
    throw Error(translateRaw('GETH_Balance'));
  }
  validAddress(t);
};

export {
  signTx,
  validAddress,
  validGasLimit,
  enoughBalanceViaTx,
  gasParamsInRange,
  validateTx,
  makeTransaction,
  getTransactionFields,
  computeIndexingHash
};
