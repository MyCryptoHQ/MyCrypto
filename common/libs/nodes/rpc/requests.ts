import { Token } from 'config/data';
import ERC20 from 'libs/erc20';
import {
  CallRequest,
  EstimateGasRequest,
  GetBalanceRequest,
  GetTokenBalanceRequest,
  GetTransactionCountRequest,
  SendRawTxRequest
} from './types';
import { hexEncodeData } from './utils';

export default class RPCRequests {
  public sendRawTx(signedTx: string): SendRawTxRequest {
    return {
      method: 'eth_sendRawTransaction',
      params: [signedTx]
    };
  }

  public estimateGas(transaction): EstimateGasRequest {
    return {
      method: 'eth_estimateGas',
      params: [transaction]
    };
  }

  public getBalance(address: string): GetBalanceRequest {
    return {
      method: 'eth_getBalance',
      params: [hexEncodeData(address), 'pending']
    };
  }

  public ethCall(transaction): CallRequest {
    return {
      method: 'eth_call',
      params: [transaction, 'pending']
    };
  }

  public getTransactionCount(address: string): GetTransactionCountRequest {
    return {
      method: 'eth_getTransactionCount',
      params: [address, 'pending']
    };
  }

  public getTokenBalance(
    address: string,
    token: Token
  ): GetTokenBalanceRequest {
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
