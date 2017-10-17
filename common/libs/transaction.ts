import { Token } from 'config/data';
import EthTx from 'ethereumjs-tx';
import { addHexPrefix, padToEven, toChecksumAddress } from 'ethereumjs-util';
import ERC20 from 'libs/erc20';
import { TransactionWithoutGas } from 'libs/messages';
import { RPCNode } from 'libs/nodes';
import { INode } from 'libs/nodes/INode';
import { Ether, toTokenUnit, UnitKey, Wei } from 'libs/units';
import { isValidETHAddress } from 'libs/validators';
import { stripHexPrefixAndLower, valueToHex } from 'libs/values';
import { IWallet } from 'libs/wallet';
import translate, { translateRaw } from 'translations';
import Big, { BigNumber } from 'bignumber.js';

export interface TransactionInput {
  token?: Token | null;
  unit: UnitKey;
  value: string;
  to: string;
  data: string;
}

export interface BroadcastTransactionStatus {
  isBroadcasting: boolean;
  signedTx: string;
  successfullyBroadcast: boolean;
}

export interface BaseTransaction {
  to: string;
  value: string;
  data: string;
  gasLimit: BigNumber | string;
  gasPrice: Wei | string;
  chainId: number;
}

export interface RawTransaction extends BaseTransaction {
  nonce: string;
}

export interface ExtendedRawTransaction extends RawTransaction {
  // non-standard, legacy
  from: string;
}

export interface CompleteTransaction extends RawTransaction {
  rawTx: string;
  signedTx: string;
}

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

function getValue(
  token: Token | null | undefined,
  tx: ExtendedRawTransaction
): BigNumber {
  let value;
  if (token) {
    value = new Big(ERC20.$transfer(tx.data).value);
  } else {
    value = new Big(tx.value);
  }
  return value;
}

async function getBalance(
  node: INode,
  tx: ExtendedRawTransaction,
  token: Token | null | undefined
) {
  const { from } = tx;
  const ETHBalance = await node.getBalance(from);
  let balance;
  if (token) {
    balance = toTokenUnit(await node.getTokenBalance(tx.from, token), token);
  } else {
    balance = ETHBalance.amount;
  }
  return {
    balance,
    ETHBalance
  };
}

async function balanceCheck(
  node: INode,
  tx: ExtendedRawTransaction,
  token: Token | null | undefined,
  value: BigNumber,
  gasCost: Wei
) {
  // Ensure their balance exceeds the amount they're sending
  const { balance, ETHBalance } = await getBalance(node, tx, token);
  if (value.gt(balance)) {
    throw new Error(translateRaw('GETH_Balance'));
  }
  // ensure gas cost is not greaterThan current eth balance
  // TODO check that eth balance is not lesser than txAmount + gasCost
  if (gasCost.amount.gt(ETHBalance.amount)) {
    throw new Error(
      `gasCost: ${gasCost.amount} greaterThan ETHBalance: ${ETHBalance.amount}`
    );
  }
}

function generateTxValidation(
  to: string,
  token: Token | null | undefined,
  data: string,
  gasLimit: BigNumber | string,
  gasPrice: Wei | string,
  skipEthAddressValidation: boolean
) {
  // Reject bad addresses
  if (!isValidETHAddress(to) && !skipEthAddressValidation) {
    throw new Error(translateRaw('ERROR_5'));
  }
  // Reject token transactions without data
  if (token && !data) {
    throw new Error('Tokens must be sent with data');
  }
  if (typeof gasLimit === 'string' || typeof gasPrice === 'string') {
    throw Error('Gas Limit and Gas Price should be of type bignumber');
  }
  // Reject gas limit under 21000 (Minimum for transaction)
  // Reject if limit over 5000000
  // TODO: Make this dynamic, the limit shifts
  if (gasLimit.lessThan(21000)) {
    throw new Error('Gas limit must be at least 21000 for transactions');
  }
  // Reject gasLimit over 5000000gwei
  if (gasLimit.greaterThan(5000000)) {
    throw new Error(translateRaw('GETH_GasLimit'));
  }
  // Reject gasPrice over 1000gwei (1000000000000)
  const gwei = new Big('1000000000000');
  if (gasPrice.amount.greaterThan(gwei)) {
    throw new Error(
      'Gas price too high. Please contact support if this was not a mistake.'
    );
  }
}

export async function generateCompleteTransactionFromRawTransaction(
  node: INode,
  tx: ExtendedRawTransaction,
  wallet: IWallet,
  token: Token | null | undefined,
  skipValidation: boolean,
  offline?: boolean
): Promise<CompleteTransaction> {
  const { to, data, gasLimit, gasPrice, chainId, nonce } = tx;
  // validation
  generateTxValidation(to, token, data, gasLimit, gasPrice, skipValidation);
  // duplicated from generateTxValidation -- typescript bug
  if (typeof gasLimit === 'string' || typeof gasPrice === 'string') {
    throw Error('Gas Limit and Gas Price should be of type bignumber');
  }
  // computed gas cost (gasprice * gaslimit)
  const gasCost: Wei = new Wei(gasPrice.amount.times(gasLimit));
  // get amount value (either in ETH or in Token)
  const value = getValue(token, tx);
  // if not offline, ensure that balance exceeds costs
  if (!offline) {
    await balanceCheck(node, tx, token, value, gasCost);
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

  return {
    ...cleanedRawTx,
    rawTx: rawTxJson,
    signedTx
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
  gasLimit: BigNumber,
  chainId: number,
  transactionInput: TransactionInput,
  skipValidation: boolean,
  nonce?: number | null,
  offline?: boolean
): Promise<CompleteTransaction> {
  const { token } = transactionInput;
  const { from, to, value, data } = await formatTxInput(
    wallet,
    transactionInput
  );
  const transaction: ExtendedRawTransaction = {
    nonce: nonce ? `0x${nonce}` : await nodeLib.getTransactionCount(from),
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
    token,
    skipValidation,
    offline
  );
}

// TODO determine best place for helper function
export function getBalanceMinusGasCosts(
  gasLimit: BigNumber,
  gasPrice: Wei,
  balance: Wei
): Ether {
  const weiGasCosts = gasPrice.amount.times(gasLimit);
  const weiBalanceMinusGasCosts = balance.amount.minus(weiGasCosts);
  return new Ether(weiBalanceMinusGasCosts);
}
