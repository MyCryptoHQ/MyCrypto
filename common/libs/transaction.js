// @flow
import Big from 'bignumber.js';
import translate from 'translations';
import { padToEven, addHexPrefix, toChecksumAddress } from 'ethereumjs-util';
import { isValidETHAddress } from 'libs/validators';
import ERC20 from 'libs/erc20';
import { toTokenUnit } from 'libs/units';
import { stripHex } from 'libs/values';
import type { INode } from 'libs/nodes/INode';
import type { BaseWallet } from 'libs/wallet';
import type { Token } from 'config/data';
import type EthTx from 'ethereumjs-tx';
import { toUnit } from 'libs/units';

export type BroadcastStatusTransaction = {
  isBroadcasting: boolean,
  signedTx: string,
  successfullyBroadcast: boolean
};

// TODO: Enforce more bigs, or find better way to avoid ether vs wei for value
export type TransactionWithoutGas = {|
  from: string,
  to: string,
  gasLimit?: string | number,
  value: string | number,
  data?: string,
  chainId?: number
|};

export type Transaction = {|
  ...TransactionWithoutGas,
  gasPrice: string | number
|};

export type RawTransaction = {|
  nonce: string,
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,
  chainId: number
|};

export type BroadcastTransaction = {|
  ...RawTransaction,
  rawTx: string,
  signedTx: string
|};

// Get useable fields from an EthTx object.
export function getTransactionFields(tx: EthTx) {
  // For some crazy reason, toJSON spits out an array, not keyed values.
  const [nonce, gasPrice, gasLimit, to, value, data, v, r, s] = tx.toJSON();

  return {
    // No value comes back as '0x', but most things expect '0x00'
    value: value === '0x' ? '0x00' : value,
    // If data is 0x, it might as well not be there
    data: data === '0x' ? null : data,
    // To address is unchecksummed, which could cause mismatches in comparisons
    to: toChecksumAddress(to),
    // Everything else is as-is
    nonce,
    gasPrice,
    gasLimit,
    v,
    r,
    s
  };
}

export async function generateTransaction(
  node: INode,
  tx: Transaction,
  wallet: BaseWallet,
  token: ?Token
): Promise<BroadcastTransaction> {
  // Reject bad addresses
  if (!isValidETHAddress(tx.to)) {
    throw new Error(translate('ERROR_5'));
  }

  // Reject token transactions without data
  if (token && !tx.data) {
    throw new Error('Tokens must be sent with data');
  }

  // Reject gas limit under 21000 (Minimum for transaction)
  // Reject if limit over 5000000
  // TODO: Make this dynamic, the limit shifts
  const limitBig = new Big(tx.gasLimit);
  if (limitBig.lessThan(21000)) {
    throw new Error(
      translate('Gas limit must be at least 21000 for transactions')
    );
  }

  if (limitBig.greaterThan(5000000)) {
    throw new Error(translate('GETH_GasLimit'));
  }

  // Reject gas over 1000gwei (1000000000000)
  const gasPriceBig = new Big(tx.gasPrice);
  if (gasPriceBig.greaterThan(new Big('1000000000000'))) {
    throw new Error(
      'Gas price too high. Please contact support if this was not a mistake.'
    );
  }

  // Ensure their balance exceeds the amount they're sending
  // TODO: Include gas price too, tokens should probably check ETH too
  let value;
  let balance;

  if (token) {
    // $FlowFixMe - We reject above if tx has no data for token
    value = new Big(ERC20.$transfer(tx.data).value);
    balance = toTokenUnit(await node.getTokenBalance(tx.from, token), token);
  } else {
    value = new Big(tx.value);
    balance = await node.getBalance(tx.from);
  }

  if (value.gte(balance)) {
    throw new Error(translate('GETH_Balance'));
  }

  // Taken from v3's `sanitizeHex`, ensures that the value is a %2 === 0
  // prefix'd hex value.
  const cleanHex = hex => addHexPrefix(padToEven(stripHex(hex)));

  // Generate the raw transaction
  const txCount = await node.getTransactionCount(tx.from);
  const rawTx = {
    nonce: cleanHex(txCount),
    gasPrice: cleanHex(new Big(tx.gasPrice).toString(16)),
    gasLimit: cleanHex(new Big(tx.gasLimit).toString(16)),
    to: cleanHex(tx.to),
    value: token ? '0x00' : cleanHex(value.toString(16)),
    data: tx.data ? cleanHex(tx.data) : '',
    chainId: tx.chainId || 1
  };

  // Sign the transaction
  const rawTxJson = JSON.stringify(rawTx);
  const signedTx = await wallet.signRawTransaction(rawTx);

  // Repeat all of this shit for Flow typechecking. Sealed objects don't
  // like spreads, so we have to be explicit.
  return {
    nonce: rawTx.nonce,
    gasPrice: rawTx.gasPrice,
    gasLimit: rawTx.gasLimit,
    to: rawTx.to,
    value: rawTx.value,
    data: rawTx.data,
    chainId: rawTx.chainId,
    rawTx: rawTxJson,
    signedTx: signedTx
  };
}

// TODO determine best place for helper function
export function getBalanceMinusGasCosts(
  weiGasLimit: Big,
  weiGasPrice: Big,
  weiBalance: Big
): Big {
  const weiGasCosts = weiGasPrice.times(weiGasLimit);
  const weiBalanceMinusGasCosts = weiBalance.minus(weiGasCosts);
  return toUnit(weiBalanceMinusGasCosts, 'wei', 'ether');
}
