import { Token } from 'config/data';
import ERC20 from 'libs/erc20';
import RPCRequests from '../rpc/requests';
import {
  CallRequest,
  EstimateGasRequest,
  GetBalanceRequest,
  GetTokenBalanceRequest,
  GetTransactionCountRequest,
  SendRawTxRequest,
  GetCurrentBlockRequest
} from './types';

export default class EtherscanRequests extends RPCRequests {
  public sendRawTx(signedTx: string): SendRawTxRequest {
    return {
      module: 'proxy',
      action: 'eth_sendRawTransaction',
      hex: signedTx
    };
  }

  public estimateGas(transaction): EstimateGasRequest {
    return {
      module: 'proxy',
      action: 'eth_estimateGas',
      to: transaction.to,
      value: transaction.value,
      data: transaction.data,
      from: transaction.from
    };
  }

  public getBalance(address: string): GetBalanceRequest {
    return {
      module: 'account',
      action: 'balance',
      tag: 'latest',
      address
    };
  }

  public ethCall(transaction): CallRequest {
    return {
      module: 'proxy',
      action: 'eth_call',
      to: transaction.to,
      data: transaction.data
    };
  }

  public getTransactionCount(address: string): GetTransactionCountRequest {
    return {
      module: 'proxy',
      action: 'eth_getTransactionCount',
      tag: 'latest',
      address
    };
  }

  public getTokenBalance(address: string, token: Token): GetTokenBalanceRequest {
    return this.ethCall({
      to: token.address,
      data: ERC20.balanceOf.encodeInput({ _owner: address })
    });
  }

  public getCurrentBlock(): GetCurrentBlockRequest {
    return {
      module: 'proxy',
      action: 'eth_blockNumber'
    };
  }
}
