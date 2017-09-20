// @flow
import ERC20 from 'libs/erc20';
import { hexEncodeData } from './utils';
import type {
  CallRequest,
  GetBalanceRequest,
  GetTokenBalanceRequest,
  EstimateGasRequest,
  GetTransactionCountRequest,
  SendRawTxRequest
} from './types';
import type { Token } from 'config/data';

export default class RPCRequests {
  sendRawTx(signedTx: string): SendRawTxRequest {
    return {
      method: 'eth_sendRawTransaction',
      params: [signedTx]
    };
  }

  estimateGas<T: *>(transaction: T): EstimateGasRequest {
    return {
      method: 'eth_estimateGas',
      params: [transaction]
    };
  }

  getBalance(address: string): GetBalanceRequest {
    return {
      method: 'eth_getBalance',
      params: [hexEncodeData(address), 'pending']
    };
  }

  ethCall<T: *>(transaction: T): CallRequest {
    return {
      method: 'eth_call',
      params: [transaction, 'pending']
    };
  }

  getTransactionCount(address: string): GetTransactionCountRequest {
    return {
      method: 'eth_getTransactionCount',
      params: [address, 'pending']
    };
  }

  getTokenBalance(address: string, token: Token): GetTokenBalanceRequest {
    return {
      method: 'eth_call',
      params: [
        {
          to: token.address,
          data: ERC20.balanceOf(address)
        },
        'pending'
      ]
    };
  }
}
