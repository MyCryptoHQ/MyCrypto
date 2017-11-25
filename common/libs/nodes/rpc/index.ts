import BN from 'bn.js';
import { Token } from 'config/data';
import { TransactionWithoutGas } from 'libs/messages';
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

  public sendCallRequest(txObj: TxObj): Promise<string> {
    return this.client
      .call(this.requests.ethCall(txObj))
      .then(isValidCallRequest)
      .then(({ result }) => {
        return result;
      });
  }
  public getBalance(address: string): Promise<Wei> {
    return this.client
      .call(this.requests.getBalance(address))
      .then(isValidGetBalance)
      .then(({ result }) => Wei(result));
  }

  public estimateGas(transaction: TransactionWithoutGas): Promise<Wei> {
    return this.client
      .call(this.requests.estimateGas(transaction))
      .then(isValidEstimateGas)
      .then(({ result }) => Wei(result));
  }

  public getTokenBalance(address: string, token: Token): Promise<TokenValue> {
    return this.client
      .call(this.requests.getTokenBalance(address, token))
      .then(isValidTokenBalance)
      .then(({ result }) => {
        return TokenValue(result);
      });
  }

  public getTokenBalances(
    address: string,
    tokens: Token[]
  ): Promise<TokenValue[]> {
    return this.client
      .batch(tokens.map(t => this.requests.getTokenBalance(address, t)))
      .then(response => response.map(item => TokenValue(item.result)));
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
