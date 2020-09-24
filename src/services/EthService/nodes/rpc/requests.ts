import { Token } from 'shared/types/network';

import { ERC20 } from '@services/EthService';
import { Asset, IHexStrTransaction, TxObj } from '@types';
import { hexEncodeData } from '@utils';

import { UnlockToken } from '../../contracts';
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

export class RPCRequests {
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
              : 'address' in token
                ? token.address
                : '0x0',
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

  public getUnlockKeyExpirationTime(
    address: string,
    lockAddress: string
  ): GetTokenBalanceRequest | any {
    return {
      method: 'eth_call',
      params: [
        {
          to: lockAddress,
          data: UnlockToken.keyExpirationTimestampFor.encodeInput({ _owner: address })
        },
        'pending'
      ]
    };
  }
}
