// @flow
import Big from 'bignumber.js';
import { addHexPrefix } from 'ethereumjs-util';
import translate from 'translations';
import BaseNode from '../base';
import type {
  TransactionWithoutGas,
  Transaction,
  BroadcastTransaction
} from 'libs/transaction';
import RPCClient, {
  getBalance,
  estimateGas,
  getTransactionCount,
  getTokenBalance
} from './client';
import type { Token } from 'config/data';
import type { BaseWallet } from 'libs/wallet';
import { isValidETHAddress } from 'libs/validators';
import ERC20 from 'libs/erc20';

export default class RpcNode extends BaseNode {
  client: RPCClient;
  constructor(endpoint: string) {
    super();
    this.client = new RPCClient(endpoint);
  }

  async getBalance(address: string): Promise<Big> {
    return this.client.call(getBalance(address)).then(response => {
      if (response.error) {
        throw new Error('getBalance error');
      }
      return new Big(Number(response.result));
    });
  }

  async estimateGas(transaction: TransactionWithoutGas): Promise<Big> {
    return this.client.call(estimateGas(transaction)).then(response => {
      if (response.error) {
        throw new Error('estimateGas error');
      }
      return new Big(Number(response.result));
    });
  }

  async getTokenBalances(address: string, tokens: Token[]): Promise<Big[]> {
    return this.client
      .batch(tokens.map(t => getTokenBalance(address, t)))
      .then(response => {
        return response.map((item, idx) => {
          // FIXME wrap in maybe-like
          if (item.error) {
            return new Big(0);
          }
          return new Big(Number(item.result)).div(
            new Big(10).pow(tokens[idx].decimal)
          );
        });
      });
  }

  async generateTransaction(
    tx: Transaction,
    wallet: BaseWallet,
    token: ?Token
  ): Promise<BroadcastTransaction> {
    // Reject bad addresses
    if (!isValidETHAddress(tx.to)) {
      return Promise.reject(new Error(translate('ERROR_5')));
    }

    // Reject token transactions without data
    if (token && !tx.data) {
      return Promise.reject(new Error('Tokens must be sent with data'));
    }

    // Reject gas limit under 21000 (Minimum for transaction)
    // Reject if limit over 5000000
    // TODO: Make this dynamic, the limit shifts
    const limitBig = new Big(tx.gasLimit);
    if (limitBig.lessThan(21000)) {
      return Promise.reject(
        new Error(
          translate('Gas limit must be at least 21000 for transactions')
        )
      );
    }

    if (limitBig.greaterThan(5000000)) {
      return Promise.reject(new Error(translate('GETH_GasLimit')));
    }

    // Reject gas over 1000gwei (1000000000000)
    const priceBig = new Big(tx.gasPrice);
    if (priceBig.greaterThan(new Big('1000000000000'))) {
      return Promise.reject(
        new Error(
          'Gas price too high. Please contact support if this was not a mistake.'
        )
      );
    }

    // Tokens have a different balance lookup, so do that conditionally
    const calls = [
      token ? getTokenBalance(tx.from, token) : getBalance(tx.from),
      getTransactionCount(tx.from)
    ];

    return this.client.batch(calls).then(async results => {
      const [balanceRes, txCountRes] = results;

      // Catch any RPC errors
      if (balanceRes.error) {
        throw new Error(`Failed to retrieve balance for ${tx.from}`);
      }

      if (txCountRes.error) {
        throw new Error(`Failed to retrieve transaction count for ${tx.from}`);
      }

      // Ensure they have a balance larger than what they're sending
      const balance = new Big(balanceRes.result);
      let value;

      if (token) {
        // $FlowFixMe - We reject above if tx has no data for token
        const transferData = ERC20.decodeTransfer(tx.data);
        value = new Big(transferData.value);
      } else {
        value = new Big(tx.value);
      }

      if (value.gte(balance)) {
        throw new Error(translate('GETH_Balance'));
      }

      // TODO: Throw error if they lack the balance for the gas costs

      // Build the transaction, sign it
      const rawTx = {
        nonce: addHexPrefix(txCountRes.result),
        gasPrice: addHexPrefix(new Big(tx.gasPrice).toString(16)),
        gasLimit: addHexPrefix(new Big(tx.gasLimit).toString(16)),
        to: addHexPrefix(tx.to),
        value: token ? '0x0' : addHexPrefix(value.toString(16)),
        data: tx.data ? addHexPrefix(tx.data) : '',
        chainId: tx.chainId || 1
      };

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
    });
  }
}
