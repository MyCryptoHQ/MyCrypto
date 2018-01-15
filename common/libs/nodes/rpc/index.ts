import BN from 'bn.js';
import { Token } from 'config/data';
import { IHexStrTransaction } from 'libs/transaction';
import { Wei, TokenValue } from 'libs/units';
import { stripHexPrefix } from 'libs/values';
import { INode, TxObj } from '../INode';
import RPCClient from './client';
import RPCRequests from './requests';
import {
  isValidGetBalance,
  isValidEstimateGas,
  isValidCallRequest,
  isValidTokenBalance,
  isValidTransactionCount,
  isValidCurrentBlock,
  isValidRawTxApi
} from '../../validators';

export default class RpcNode implements INode {
  public client: RPCClient;
  public requests: RPCRequests;

  constructor(endpoint: string) {
    this.client = new RPCClient(endpoint);
    this.requests = new RPCRequests();
  }

  public ping(): Promise<boolean> {
    return this.client
      .call(this.requests.getNetVersion())
      .then(() => true)
      .catch(() => false);
  }

  public sendCallRequest(txObj: TxObj): Promise<string> {
    return this.client
      .call(this.requests.ethCall(txObj))
      .then(isValidCallRequest)
      .then(response => response.result);
  }
  public getBalance(address: string): Promise<Wei> {
    return this.client
      .call(this.requests.getBalance(address))
      .then(isValidGetBalance)
      .then(({ result }) => Wei(result));
  }

  public estimateGas(transaction: Partial<IHexStrTransaction>): Promise<Wei> {
    // Timeout after 10 seconds

    return this.client
      .call(this.requests.estimateGas(transaction))
      .then(isValidEstimateGas)
      .then(({ result }) => Wei(result))
      .catch(error => {
        throw new Error(error.message);
      });
  }

  public getTokenBalance(
    address: string,
    token: Token
  ): Promise<{ balance: TokenValue; error: string | null }> {
    return this.client
      .call(this.requests.getTokenBalance(address, token))
      .then(isValidTokenBalance)
      .then(({ result }) => {
        return {
          balance: TokenValue(result),
          error: null
        };
      })
      .catch(err => ({
        balance: TokenValue('0'),
        error: 'Caught error:' + err
      }));
  }

  public getTokenBalances(
    address: string,
    tokens: Token[]
  ): Promise<{ balance: TokenValue; error: string | null }[]> {
    return this.client
      .batch(tokens.map(t => this.requests.getTokenBalance(address, t)))
      .then(response =>
        response.map(item => {
          if (isValidTokenBalance(item)) {
            return {
              balance: TokenValue(item.result),
              error: null
            };
          } else {
            return {
              balance: TokenValue('0'),
              error: 'Invalid object shape'
            };
          }
        })
      );
  }

  public getTransactionCount(address: string): Promise<string> {
    return this.client
      .call(this.requests.getTransactionCount(address))
      .then(isValidTransactionCount)
      .then(({ result }) => result);
  }

  public getCurrentBlock(): Promise<string> {
    return this.client
      .call(this.requests.getCurrentBlock())
      .then(isValidCurrentBlock)
      .then(({ result }) => new BN(stripHexPrefix(result)).toString());
  }

  public sendRawTx(signedTx: string): Promise<string> {
    return this.client
      .call(this.requests.sendRawTx(signedTx))
      .then(isValidRawTxApi)
      .then(({ result }) => {
        return result;
      });
  }
}
