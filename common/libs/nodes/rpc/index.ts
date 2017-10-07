import Big, { BigNumber } from 'bignumber.js';
import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
import { Wei } from 'libs/units';
import { INode } from '../INode';
import RPCClient from './client';
import RPCRequests from './requests';

// TODO - understand response values
// "RPC" requests will sometimes resolve with 200, but contain a payload informing there was an error.
function ensureOkResponse(response: any) {
  if (response.error) {
    throw new Error(response.error.message);
  }
  if (response.status === 0) {
    throw new Error('Error!: Status Code: RSP0');
  }
  if (response.result.toLowerCase().includes('error')) {
    throw new Error('Error! Status Code: "RPCLIE"');
  }
  return response;
}

export default class RpcNode implements INode {
  public client: RPCClient;
  public requests: RPCRequests;

  constructor(endpoint: string) {
    this.client = new RPCClient(endpoint);
    this.requests = new RPCRequests();
  }

  public getBalance(address: string): Promise<Wei> {
    return this.client
      .call(this.requests.getBalance(address))
      .then(ensureOkResponse)
      .then(response => {
        return new Wei(String(response.result));
      })
      .catch(err => {
        throw new Error('Warning: Unable to Get Balance');
      });
  }

  public estimateGas(transaction: TransactionWithoutGas): Promise<BigNumber> {
    return this.client
      .call(this.requests.estimateGas(transaction))
      .then(ensureOkResponse)
      .then(response => {
        return new Big(String(response.result));
      })
      .catch(err => {
        throw new Error('Warning: Unable to Estimate Gas');
      });
  }

  public getTokenBalance(address: string, token: Token): Promise<BigNumber> {
    return this.client
      .call(this.requests.getTokenBalance(address, token))
      .then(ensureOkResponse)
      .then(response => {
        return new Big(String(response.result)).div(
          new Big(10).pow(token.decimal)
        );
      })
      .catch(err => {
        // TODO - do we want to alert if a single token request fails?
        throw new Error('Warning: Unable to Get Token Balance');
      });
  }

  public getTokenBalances(
    address: string,
    tokens: Token[]
  ): Promise<BigNumber[]> {
    return this.client
      .batch(tokens.map(t => this.requests.getTokenBalance(address, t)))
      .then(response => {
        return response.map((item, idx) => {
          // FIXME wrap in maybe-like
          if (item.error) {
            return new Big(0);
          }
          return new Big(String(item.result)).div(
            new Big(10).pow(tokens[idx].decimal)
          );
        });
      });
    // TODO - Error handling
  }

  public getTransactionCount(address: string): Promise<string> {
    return this.client
      .call(this.requests.getTransactionCount(address))
      .then(ensureOkResponse)
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.result;
      })
      .catch(err => {
        throw new Error('Warning: Unable to Get Transaction Count (Nonce)');
      });
  }

  public sendRawTx(signedTx: string): Promise<string> {
    return this.client
      .call(this.requests.sendRawTx(signedTx))
      .then(ensureOkResponse)
      .then(response => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.result;
      })
      .catch(err => {
        throw new Error('Warning: Unable Send Raw Tx');
      });
  }
}
