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
  }

  /* Tested*/
  public estimateGas(transaction: Partial<IHexStrTransaction>): Promise<string> {
    return this.client.estimateGas(transaction).then(data => data.toString());
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
  }

  /* Tested */
  public getTransactionCount(address: string): Promise<number> {
    return this.client.getTransactionCount(address).then(data => data);
  }

  /* Tested */
  public getTransactionByHash(txhash: string): Promise<TransactionResponse> {
    return this.client.getTransaction(txhash).then((data): TransactionResponse => data);
  }

  /* Tested */
  public getTransactionReceipt(txhash: string): Promise<TransactionReceipt> {
    return this.client.getTransactionReceipt(txhash).then(data => data);
  }

  /* Tested */
  public getCurrentBlock(): Promise<string> {
    return this.client.getBlockNumber().then(data => data.toString());
  }

  public sendRawTx(signedTx: string): Promise<TransactionResponse> {
    return this.client.sendTransaction(signedTx).then((data): TransactionResponse => data);
  }

  /* TODO: Needs handling for web3 providers. */
  private fetchProvider(network: Network): FallbackProvider {
    return createProviderHandler(network);
  }
}

export default ProviderHandler;
