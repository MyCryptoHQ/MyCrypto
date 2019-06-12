import ERC20 from 'libs/erc20';
import {
  CallRequest,
  EstimateGasRequest,
  GetBalanceRequest,
  GetTokenBalanceRequest,
  GetTransactionCountRequest,
  SendRawTxRequest,
  GetCurrentBlockRequest,
  GetTransactionByHashRequest,
  GetTransactionReceiptRequest
} from './types';
import { hexEncodeData } from './utils';
import { TxObj } from '../INode';
import { IHexStrTransaction } from 'libs/transaction';
import { Asset } from 'v2/services/Asset/types';
import { Token } from 'shared/types/network';

export default class RPCRequests {
  public getNetVersion() {
    return { method: 'net_version' };
  }

  public sendRawTx(signedTx: string): SendRawTxRequest | any {
    return {
      method: 'eth_sendRawTransaction',
      params: [signedTx]
    };
  }

  public estimateGas(transaction: Partial<IHexStrTransaction>): EstimateGasRequest | any {
    return {
      method: 'eth_estimateGas',
      params: [transaction]
    };
  }

  public getBalance(address: string): GetBalanceRequest | any {
    return {
      method: 'eth_getBalance',
      params: [hexEncodeData(address), 'pending']
    };
  }

  public ethCall(txObj: TxObj): CallRequest | any {
    return {
      method: 'eth_call',
      params: [txObj, 'pending']
    };
  }

  public getTransactionCount(address: string): GetTransactionCountRequest | any {
    return {
      method: 'eth_getTransactionCount',
      params: [address, 'pending']
    };
  }

  public getTransactionByHash(txhash: string): GetTransactionByHashRequest | any {
    return {
      method: 'eth_getTransactionByHash',
      params: [txhash]
    };
  }

  public getTransactionReceipt(txhash: string): GetTransactionReceiptRequest | any {
    return {
      method: 'eth_getTransactionReceipt',
      params: [txhash]
    };
  }

  public getTokenBalance(address: string, token: Asset | Token): GetTokenBalanceRequest | any {
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

  public getCurrentBlock(): GetCurrentBlockRequest | any {
    return {
      method: 'eth_blockNumber'
    };
  }
}
