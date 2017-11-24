import Tx from 'ethereumjs-tx';
import { bufferToHex, toChecksumAddress } from 'ethereumjs-util';
import { Wei } from 'libs/units';
import { isValidETHAddress } from 'libs/validators';
import { IWallet } from 'libs/wallet';
import { translateRaw } from 'translations';
import { ITransaction, IHexStrTransaction } from '../typings';
import { sanitizeHex } from 'libs/values';
import { hexEncodeQuantity, hexEncodeData } from 'libs/nodes/rpc/utils';

export {
  signTx,
  validAddress,
  validGasLimit,
  enoughBalance,
  gasParamsInRange,
  validateTx,
  transaction,
  getTransactionFields
};

// Get useable fields from an EthTx object.
const getTransactionFields = (
  t: Tx,
  withSigParams: boolean = false
): IHexStrTransaction => {
  // For some crazy reason, toJSON spits out an array, not keyed values.
  const { data, gasLimit, gasPrice, to, nonce, value } = t;

  /*
  let address 
  try {
    address = sanitizeHex(t.getSenderAddress().toString('hex'))
  }
  catch {
    address = null
  }*/
  return {
    // No value comes back as '0x', but most things expect '0x00'
    value: hexEncodeQuantity(value),
    data: hexEncodeData(data),
    // To address is unchecksummed, which could cause mismatches in comparisons
    to: hexEncodeData(to),
    // Everything else is as-is
    nonce: hexEncodeQuantity(nonce),
    gasPrice: hexEncodeQuantity(gasPrice),
    gasLimit: hexEncodeQuantity(gasLimit)
  };
};

/**
 * @description Return the minimum amount of ether needed
 * @param t
 */
const enoughBalance = (t: Tx | ITransaction, accountBalance: Wei) =>
  transaction(t)
    .getUpfrontCost()
    .lte(accountBalance);

/**
 * @description Return the minimum amount of gas needed (for gas limit validation)
 * @param t
 */
const validGasLimit = (t: ITransaction) =>
  transaction(t)
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

const transaction = (t: ITransaction | IHexStrTransaction) => new Tx(t);

//TODO: check that addresses are always checksummed
const signTx = async (t: ITransaction, w: IWallet) => {
  const tx = transaction(t);
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
