// @flow
import BaseNode from './base';
import { randomBytes } from 'crypto';
import Big from 'big.js';
import EthTx from 'ethereumjs-tx';
import { sanitizeHex, decimalToHex } from 'utils/formatters';
import { toWei } from 'libs/units';
import type { UNIT } from 'libs/units';

type JsonRpcSuccess = {|
  id: string,
  result: string
|};

type JsonRpcError = {|
  error: {
    code: string,
    message: string,
    data?: any
  }
|};

type JsonRpcResponse = JsonRpcSuccess | JsonRpcError;

// FIXME
type EthCall = any;

export type TransactionData = {
  to: string,
  from: string,
  value: string,
  unit: UNIT,
  gasLimit: string,
  data: ?string,
  // TODO: Make optional for hardware wallets?
  pkey: string
};

// FIXME
export type Transaction = {
  nonce: string,
  gasPrice: string,
  gasLimit: string,
  to: string,
  value: string,
  data: string,
  rawTx: string,
  signedTx: string
};

export default class RPCNode extends BaseNode {
  endpoint: string;
  constructor(endpoint: string) {
    super();
    this.endpoint = endpoint;
  }

  async getBalance(address: string): Promise<Big> {
    return this.post('eth_getBalance', [address, 'pending']).then(response => {
      if (response.error) {
        throw new Error(response.error.message);
      }
      // FIXME is this safe?
      return new Big(Number(response.result));
    });
  }

  async generateTransaction(txData: TransactionData): Promise<Transaction> {
    return new Promise(async (resolve, reject) => {
      try {
        const requests = [
          this.post('eth_getBalance', [txData.from, 'pending']),
          this.post('eth_getTransactionCount', [txData.from, 'pending']),
          this.post('eth_gasPrice')
        ];

        // TODO: Handle offline?
        const results = await Promise.all(requests);
        if (results[0].error || results[1].error || results[2].error) {
          throw new Error('Failed request to RPC server');
        }

        const rawTx = {
          nonce: sanitizeHex(results[1].result),
          // $FlowFixMe
          gasPrice: sanitizeHex(results[2].result),
          gasLimit: sanitizeHex(decimalToHex(txData.gasLimit)),
          to: sanitizeHex(txData.to),
          value: decimalToHex(toWei(new Big(txData.value), txData.unit)),
          data: txData.data ? sanitizeHex(txData.data) : undefined
        };

        // TODO: Hardware wallet signing?
        const ethTx = new EthTx(rawTx);
        ethTx.sign(new Buffer(txData.pkey, 'hex'));

        resolve({
          ...rawTx,
          rawTx: JSON.stringify(rawTx),
          signedTx: `0x${ethTx.serialize().toString('hex')}`
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // FIXME extract batching
  async ethCall(calls: EthCall[]) {
    return this.batchPost(
      calls.map(params => {
        return {
          id: randomBytes(16).toString('hex'),
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [params, 'pending']
        };
      })
    );
  }

  async post(method: string, params: string[] = []): Promise<JsonRpcResponse> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: randomBytes(16).toString('hex'),
        jsonrpc: '2.0',
        method,
        params
      })
    }).then(r => r.json());
  }

  // FIXME
  async batchPost(requests: any[]): Promise<JsonRpcResponse[]> {
    return fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requests)
    }).then(r => r.json());
  }
}
