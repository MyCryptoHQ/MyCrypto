// @flow
import Big from 'bignumber.js';
import translate from 'translations';
import { padToEven, addHexPrefix, toChecksumAddress } from 'ethereumjs-util';
import { isValidETHAddress } from 'libs/validators';
import ERC20 from 'libs/erc20';
import { stripHexPrefixAndLower, valueToHex } from 'libs/values';
import { Wei, Ether, toTokenUnit } from 'libs/units';
import { RPCNode } from 'libs/nodes';
import { TransactionWithoutGas } from 'libs/messages';
import type { INode } from 'libs/nodes/INode';
import type { IWallet } from 'libs/wallet';
import type { Token } from 'config/data';
import type EthTx from 'ethereumjs-tx';
import type { UNIT } from 'libs/units';

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
  gasLimit: Big,
  gasPrice: Wei,
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
  wallet: IWallet,
  token: ?Token
): Promise<CompleteTransaction> {
  const { to, data, gasLimit, gasPrice, from, chainId, nonce } = tx;
  // Reject bad addresses
  if (!isValidETHAddress(to)) {
    throw new Error(translate('ERROR_5', true));
  }
  // Reject token transactions without data
  if (token && !data) {
    throw new Error('Tokens must be sent with data');
  }
  // Reject gas limit under 21000 (Minimum for transaction)
  // Reject if limit over 5000000
  // TODO: Make this dynamic, the limit shifts
  if (gasLimit.lessThan(21000)) {
    throw new Error('Gas limit must be at least 21000 for transactions');
  }
  // Reject gasLimit over 5000000gwei
  if (gasLimit.greaterThan(5000000)) {
    throw new Error(translate('GETH_GasLimit', true));
  }
  // Reject gasPrice over 1000gwei (1000000000000)
  if (gasPrice.amount.greaterThan(new Big('1000000000000'))) {
    throw new Error(
      'Gas price too high. Please contact support if this was not a mistake.'
    );
  }
  // build gasCost by multiplying gasPrice * gasLimit
  const gasCost: Wei = new Wei(gasPrice.amount.times(gasLimit));
  // Ensure their balance exceeds the amount they're sending
  let value;
  let balance;
  const ETHBalance: Wei = await node.getBalance(from);
  if (token) {
    value = new Big(ERC20.$transfer(tx.data).value);
    balance = toTokenUnit(await node.getTokenBalance(tx.from, token), token);
  } else {
    value = new Big(tx.value);
    balance = ETHBalance.amount;
  }
  if (value.gt(balance)) {
    throw new Error(translate('GETH_Balance', true));
  }
  // ensure gas cost is not greaterThan current eth balance
  // TODO check that eth balance is not lesser than txAmount + gasCost
  if (gasCost.amount.gt(ETHBalance.amount)) {
    throw new Error(
      `gasCost: ${gasCost.amount} greaterThan ETHBalance: ${ETHBalance.amount}`
    );
  }
  // Taken from v3's `sanitizeHex`, ensures that the value is a %2 === 0
  // prefix'd hex value.
  const cleanHex = hex => addHexPrefix(padToEven(stripHexPrefixAndLower(hex)));
  const cleanedRawTx = {
    nonce: cleanHex(nonce),
    gasPrice: cleanHex(gasPrice.toString(16)),
    gasLimit: cleanHex(gasLimit.toString(16)),
    to: toChecksumAddress(cleanHex(to)),
    value: token ? '0x00' : cleanHex(value.toString(16)),
    data: data ? cleanHex(data) : '',
    chainId: chainId || 1
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
  wallet: IWallet,
  { token, unit, value, to, data }: TransactionInput
): Promise<TransactionWithoutGas> {
  if (unit === 'ether') {
    return {
      to,
      from: await wallet.getAddress(),
      value: valueToHex(new Ether(value)),
      data
    };
  } else {
    if (!token) {
      throw new Error('No matching token');
    }
    const bigAmount = new Big(value);
    const ERC20Data = ERC20.transfer(to, bigAmount);
    return {
      to: token.address,
      from: await wallet.getAddress(),
      value: '0x0',
      data: ERC20Data
    };
  }
}

export async function generateCompleteTransaction(
  wallet: IWallet,
  nodeLib: RPCNode,
  gasPrice: Wei,
  gasLimit: Big,
  chainId: number,
  transactionInput: TransactionInput
): Promise<CompleteTransaction> {
  const { token } = transactionInput;
  const { from, to, value, data } = await formatTxInput(
    wallet,
    transactionInput
  );
  const transaction: ExtendedRawTransaction = {
    nonce: await nodeLib.getTransactionCount(from),
    from,
    to,
    gasLimit,
    value,
    data,
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
  gasLimit: Big,
  gasPrice: Wei,
  balance: Wei
): Ether {
  const weiGasCosts = gasPrice.amount.times(gasLimit);
  const weiBalanceMinusGasCosts = balance.amount.minus(weiGasCosts);
  return new Ether(weiBalanceMinusGasCosts);
}
