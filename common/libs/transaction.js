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
import { valueToHex } from 'libs/values';
import type { UNIT } from 'libs/units';
import { RPCNode } from 'libs/nodes';
import { TransactionWithoutGas } from 'libs/messages';

export type TransactionInput = {
  token: ?Token,
  unit: UNIT,
  value: string,
  to: string,
  data: string
};

export type BroadcastTransactionStatus = {
  isBroadcasting: boolean,
  signedTx: string,
  successfullyBroadcast: boolean
};

export type BaseTransaction = {|
  to: string,
  value: string,
  data: string,
  gasLimit: string,
  gasPrice: string,
  chainId: number
|};

export type RawTransaction = {|
  ...BaseTransaction,
  nonce: string
|};

export type ExtendedRawTransaction = {|
  ...RawTransaction,
  // non-standard, legacy
  from: string
|};

export type CompleteTransaction = {|
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

export async function generateCompleteTransactionFromRawTransaction(
  node: INode,
  tx: ExtendedRawTransaction,
  wallet: BaseWallet,
  token: ?Token
): Promise<CompleteTransaction> {
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

  const cleanedRawTx = {
    nonce: cleanHex(tx.nonce),
    gasPrice: cleanHex(new Big(tx.gasPrice).toString(16)),
    gasLimit: cleanHex(new Big(tx.gasLimit).toString(16)),
    to: cleanHex(tx.to),
    value: token ? '0x00' : cleanHex(value.toString(16)),
    data: tx.data ? cleanHex(tx.data) : '',
    chainId: tx.chainId || 1
  };

  // Sign the transaction
  const rawTxJson = JSON.stringify(cleanedRawTx);
  const signedTx = await wallet.signRawTransaction(cleanedRawTx);

  // Repeat all of this shit for Flow typechecking. Sealed objects don't
  // like spreads, so we have to be explicit.
  return {
    nonce: cleanedRawTx.nonce,
    gasPrice: cleanedRawTx.gasPrice,
    gasLimit: cleanedRawTx.gasLimit,
    to: cleanedRawTx.to,
    value: cleanedRawTx.value,
    data: cleanedRawTx.data,
    chainId: cleanedRawTx.chainId,
    rawTx: rawTxJson,
    signedTx: signedTx
  };
}

export async function formatTxInput(
  wallet: BaseWallet,
  { token, unit, value, to, data }: TransactionInput
): Promise<TransactionWithoutGas> {
  if (unit === 'ether') {
    return {
      to,
      from: await wallet.getAddress(),
      value: valueToHex(value),
      data
    };
  } else {
    if (!token) {
      throw new Error('No matching token');
    }
    const bigAmount = new Big(value);
    return {
      to: token.address,
      from: await wallet.getAddress(),
      value: '0x0',
      data: ERC20.transfer(to, toTokenUnit(bigAmount, token))
    };
  }
}

export async function generateCompleteTransaction(
  wallet: BaseWallet,
  nodeLib: RPCNode,
  gasPrice: string,
  gasLimit: string,
  chainId: number,
  transactionInput: TransactionInput
): Promise<CompleteTransaction> {
  const { token } = transactionInput;

  const formattedTx = await formatTxInput(wallet, transactionInput);

  const from = await wallet.getAddress();

  const transaction: ExtendedRawTransaction = {
    nonce: await nodeLib.getTransactionCount(from),
    from,
    to: formattedTx.to,
    gasLimit,
    value: formattedTx.value,
    data: formattedTx.data,
    chainId,
    gasPrice
  };

  return await generateCompleteTransactionFromRawTransaction(
    nodeLib,
    transaction,
    wallet,
    token
  );
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
