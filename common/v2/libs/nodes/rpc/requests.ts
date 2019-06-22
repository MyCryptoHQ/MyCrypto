import ERC20 from 'libs/erc20';
import { IHexStrTransaction } from 'libs/transaction';
import { Token } from 'shared/types/network';
import { Asset } from 'v2/services/Asset/types';
import { TxObj } from '../INode';
import {
  CallRequest,
  EstimateGasRequest,
  GetBalanceRequest,
  GetCurrentBlockRequest,
  GetTokenBalanceRequest,
  GetTransactionByHashRequest,
  GetTransactionCountRequest,
  GetTransactionReceiptRequest,
  SendRawTxRequest
} from './types';
import { hexEncodeData } from './utils';

// we can make these static methods so that RPCRequests don't need to be instiated each timegi
export default class RPCRequests {
  public static getNetVersion() {
    return { method: 'net_version' };
  }

  public static sendRawTx(signedTx: string): SendRawTxRequest | any {
    return {
      method: 'eth_sendRawTransaction',
      params: [signedTx]
    };
  }

  public static estimateGas(transaction: Partial<IHexStrTransaction>): EstimateGasRequest | any {
    return {
      method: 'eth_estimateGas',
      params: [transaction]
    };
  }

  public static getBalance(address: string): GetBalanceRequest | any {
    return {
      method: 'eth_getBalance',
      params: [hexEncodeData(address), 'pending']
    };
  }

  public static ethCall(txObj: TxObj): CallRequest | any {
    return {
      method: 'eth_call',
      params: [txObj, 'pending']
    };
  }

  public static getTransactionCount(address: string): GetTransactionCountRequest | any {
    return {
      method: 'eth_getTransactionCount',
      params: [address, 'pending']
    };
  }

  public static getTransactionByHash(txhash: string): GetTransactionByHashRequest | any {
    return {
      method: 'eth_getTransactionByHash',
      params: [txhash]
    };
  }

  public static getTransactionReceipt(txhash: string): GetTransactionReceiptRequest | any {
    return {
      method: 'eth_getTransactionReceipt',
      params: [txhash]
    };
  }

  public static getTokenBalance(
    address: string,
    token: Asset | Token
  ): GetTokenBalanceRequest | any {
    return {
      method: 'eth_call',
      params: [
        {
          to:
            'contractAddress' in token
              ? token.contractAddress
              : 'address' in token ? token.address : '0x0',
          data: ERC20.balanceOf.encodeInput({ _owner: address })
        },
        'pending'
      ]
    };
  }

  public static getCurrentBlock(): GetCurrentBlockRequest | any {
    return {
      method: 'eth_blockNumber'
    };
  }
}
