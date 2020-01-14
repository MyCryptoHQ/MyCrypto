import { FallbackProvider, TransactionReceipt, TransactionResponse, Block } from 'ethers/providers';
import { formatEther, BigNumber } from 'ethers/utils';

import { Asset, Network, IHexStrTransaction, TxObj } from 'v2/types';
import { RPCRequests, baseToConvertedUnit, ERC20 } from 'v2/services/EthService';
import { DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { EthersJS } from './ethersJsProvider';

export class ProviderHandler {
  public network: Network;
  public client: FallbackProvider;
  public requests: RPCRequests;

  constructor(network: Network) {
    this.network = network;
    this.client = this.fetchProvider(network);
    this.requests = new RPCRequests();
  }

  public call(txObj: TxObj): Promise<string> {
    return this.client.call(txObj);
  }

  /* Tested */
  public getBalance(address: string): Promise<string> {
    return this.getRawBalance(address).then(data => formatEther(data));
  }

  public getRawBalance(address: string): Promise<BigNumber> {
    return this.client.getBalance(address);
  }

  /* Tested*/
  public estimateGas(transaction: Partial<IHexStrTransaction>): Promise<string> {
    return this.client.estimateGas(transaction).then(data => data.toString());
  }

  public getRawTokenBalance(address: string, token: Asset): Promise<string> {
    return this.client
      .call({
        to: this.requests.getTokenBalance(address, token).params[0].to,
        data: this.requests.getTokenBalance(address, token).params[0].data
      })
      .then(data => ERC20.balanceOf.decodeOutput(data))
      .then(({ balance }) => balance);
  }

  /* Tested */
  public getTokenBalance(address: string, token: Asset): Promise<string> {
    return this.getRawTokenBalance(address, token).then(balance =>
      baseToConvertedUnit(balance, token.decimal || DEFAULT_ASSET_DECIMAL)
    );
  }

  /* Tested */
  public getTransactionCount(address: string): Promise<number> {
    return this.client.getTransactionCount(address);
  }

  /* Tested */
  public getTransactionByHash(txhash: string): Promise<TransactionResponse> {
    return this.client.getTransaction(txhash);
  }

  /* Tested */
  public getTransactionReceipt(txhash: string): Promise<TransactionReceipt> {
    return this.client.getTransactionReceipt(txhash);
  }

  public getBlockByHash(blockHash: string): Promise<Block> {
    return this.client.getBlock(blockHash, false);
  }

  public getBlockByNumber(blockNumber: number): Promise<Block> {
    return this.client.getBlock(blockNumber, false);
  }

  /* Tested */
  public getCurrentBlock(): Promise<string> {
    return this.client.getBlockNumber().then(data => data.toString());
  }

  public sendRawTx(signedTx: string): Promise<TransactionResponse> {
    return this.client.sendTransaction(signedTx);
  }

  public waitForTransaction(txHash: string, confirmations?: number): Promise<TransactionReceipt> {
    return this.client.waitForTransaction(txHash, confirmations);
  }

  /* TODO: Needs handling for web3 providers. */
  private fetchProvider(network: Network): FallbackProvider {
    return EthersJS.getEthersInstance(network);
  }
}
