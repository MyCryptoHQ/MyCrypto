import { Network } from 'v2/services/Network/types';
import { TxObj } from 'v2/libs/nodes/INode';
import { IHexStrTransaction } from 'v2/libs/transaction/typings';
import { Asset } from 'v2/services/Asset/types';
import { createProviderHandler } from './globalProvider';
import { FallbackProvider, TransactionResponse, TransactionReceipt } from 'ethers/providers';
import RPCRequests from 'v2/libs/nodes/rpc/requests';
import ERC20 from 'v2/libs/erc20';
import { formatEther } from 'ethers/utils/units';
import * as units from 'v2/libs/units';

class ProviderHandler {
  public network: Network;
  public client: FallbackProvider;
  public requests: RPCRequests;

  constructor(network: Network) {
    this.network = network;
    this.client = this.fetchProvider(network);
    this.requests = new RPCRequests();
  }

  public call(txObj: TxObj): Promise<string> {
    return this.client.call(this.requests.ethCall(txObj)).then(response => response);
  }

  /* Tested */
  public getBalance(address: string): Promise<string> {
    return this.client.getBalance(address).then(data => formatEther(data));
    /*
      .call(this.requests.getBalance(address))
      .then(isValidGetBalance)
      .then(({ result }) => Wei(result));*/
  }

  /* Tested*/
  public estimateGas(transaction: Partial<IHexStrTransaction>): Promise<string> {
    return this.client.estimateGas(transaction).then(data => data.toString());
    /*
      .call(this.requests.estimateGas(transaction))
      .then(isValidEstimateGas)
      .then(({ result }) => Wei(result))
      .catch(error => {
        throw new Error(error.message);
      });*/
  }

  /* Tested */
  public getTokenBalance(address: string, token: Asset): Promise<string> {
    return this.client
      .call({
        to: this.requests.getTokenBalance(address, token).params[0].to,
        data: this.requests.getTokenBalance(address, token).params[0].data
      })
      .then(data => ERC20.balanceOf.decodeOutput(data))
      .then(({ balance }) => {
        if (token.decimal) {
          return units.baseToConvertedUnit(balance, token.decimal);
        }
        return units.baseToConvertedUnit(balance, 18);
      });
    /*
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
      */
  }

  public getTransactionCount(address: string): Promise<number> {
    return this.client.getTransactionCount(address).then(data => data);
    /*
      .call(this.requests.getTransactionCount(address))
      .then(isValidTransactionCount)
      .then(({ result }) => result);
      */
  }

  public getTransactionByHash(txhash: string): Promise<TransactionResponse> {
    return this.client.getTransaction(txhash).then((data): TransactionResponse => data);
    /*
      .call(this.requests.getTransactionByHash(txhash))
      .then(isValidTransactionByHash)
      .then(({ result }) => ({
        ...result,
        to: result.to || '0x0',
        value: Wei(result.value),
        gasPrice: Wei(result.gasPrice),
        gas: Wei(result.gas),
        nonce: hexToNumber(result.nonce),
        blockNumber: result.blockNumber ? hexToNumber(result.blockNumber) : null,
        transactionIndex: result.transactionIndex ? hexToNumber(result.transactionIndex) : null
      }));
      */
  }

  public getTransactionReceipt(txhash: string): Promise<TransactionReceipt> {
    return this.client.getTransactionReceipt(txhash).then(data => data);
    /*
      .call(this.requests.getTransactionReceipt(txhash))
      .then(isValidTransactionReceipt)
      .then(({ result }) => ({
        ...result,
        transactionIndex: hexToNumber(result.transactionIndex),
        blockNumber: hexToNumber(result.blockNumber),
        cumulativeGasUsed: Wei(result.cumulativeGasUsed),
        gasUsed: Wei(result.gasUsed),
        status: result.status ? hexToNumber(result.status) : null,
        root: result.root || null
      }));
      */
  }

  public getCurrentBlock(): Promise<string> {
    return this.client.getBlockNumber().then(data => data.toString());
    /*
      .call(this.requests.getCurrentBlock())
      .then(isValidCurrentBlock)
      .then(({ result }) => new BN(stripHexPrefix(result)).toString());
      */
  }

  public sendRawTx(signedTx: string): Promise<TransactionResponse> {
    return this.client.sendTransaction(signedTx).then((data): TransactionResponse => data);
    /*
      .sendTransaction(this.requests.sendRawTx(signedTx))
      .then(isValidRawTxApi)
      .then(({ result }) => {
        return result;
      });
      */
  }

  private fetchProvider(network: Network): FallbackProvider {
    const x = createProviderHandler(network);
    console.log(x);
    return x;
  }
}

export default ProviderHandler;
