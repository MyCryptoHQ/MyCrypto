// @flow
import ERC20 from 'libs/erc20';
import RPCRequests from '../rpc/requests';
import type {
  CallRequest,
  GetBalanceRequest,
  GetTokenBalanceRequest,
  EstimateGasRequest,
  GetTransactionCountRequest,
  SendRawTxRequest
} from './types';
import type { Token } from 'config/data';

export default class EtherscanRequests extends RPCRequests {
  sendRawTx(signedTx: string): SendRawTxRequest {
    return {
      module: 'proxy',
      method: 'eth_sendRawTransaction',
      hex: signedTx
    };
  }

  estimateGas<T: *>(transaction: T): EstimateGasRequest {
    return {
      module: 'proxy',
      method: 'eth_estimateGas',
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      from: transaction.from
    };
  }

  getBalance(address: string): GetBalanceRequest {
    return {
      module: 'account',
      action: 'balance',
      tag: 'latest',
      address
    };
  }

  ethCall<T: *>(transaction: T): CallRequest {
    return {
      module: 'proxy',
      action: 'eth_call',
      to: transaction.to,
      data: transaction.data
    };
  }

  getTransactionCount(address: string): GetTransactionCountRequest {
    return {
      module: 'proxy',
      action: 'eth_getTransactionCount',
      tag: 'latest',
      address
    };
  }

  getTokenBalance(address: string, token: Token): GetTokenBalanceRequest {
    return this.ethCall({
      to: token.address,
      data: ERC20.balanceOf(address)
    });
  }
}
