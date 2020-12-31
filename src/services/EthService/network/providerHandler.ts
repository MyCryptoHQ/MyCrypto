import any from '@ungap/promise-any';
import {
  BaseProvider,
  Block,
  FallbackProvider,
  TransactionReceipt,
  TransactionResponse
} from 'ethers/providers';
import { BigNumber, formatEther } from 'ethers/utils';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { ERC20, RPCRequests } from '@services/EthService';
import { Asset, IHexStrTransaction, ITxSigned, Network, TxObj, ITokenApprovalLogs } from '@types';
import { baseToConvertedUnit } from '@utils';

import { EthersJS } from './ethersJsProvider';
import { createCustomNodeProvider } from './helpers';

export class ProviderHandler {
  /* @todo: Needs handling for web3 providers. */
  public static fetchProvider(network: Network): FallbackProvider {
    return EthersJS.getEthersInstance(network);
  }

  public static fetchSingleProvider(network: Network): BaseProvider {
    return createCustomNodeProvider(network);
  }

  public network: Network;
  public requests: RPCRequests;
  private isFallbackProvider: boolean;

  constructor(network: Network, isFallbackProvider = true) {
    this.network = network;
    this.requests = new RPCRequests();
    this.isFallbackProvider = isFallbackProvider;
  }

  public call(txObj: TxObj): Promise<string> {
    return this.injectClient((client) => {
      return client.call(txObj);
    });
  }

  /* Tested */
  public getBalance(address: string): Promise<string> {
    return this.getRawBalance(address).then((data) => formatEther(data));
  }

  public getRawBalance(address: string): Promise<BigNumber> {
    return this.injectClient((client) => client.getBalance(address));
  }

  /* Tested*/
  public estimateGas(transaction: Partial<IHexStrTransaction>): Promise<string> {
    return this.injectClient((client) =>
      client.estimateGas(transaction).then((data) => data.toString())
    );
  }

  public getRawTokenBalance(address: string, token: Asset): Promise<string> {
    return this.injectClient((client) =>
      client
        .call({
          to: this.requests.getTokenBalance(address, token).params[0].to,
          data: this.requests.getTokenBalance(address, token).params[0].data
        })
        .then((data) => ERC20.balanceOf.decodeOutput(data))
        .then(({ balance }) => balance)
    );
  }

  /* Tested */
  public getTokenBalance(address: string, token: Asset): Promise<string> {
    return this.getRawTokenBalance(address, token).then((balance) =>
      baseToConvertedUnit(balance, token.decimal || DEFAULT_ASSET_DECIMAL)
    );
  }

  /* Tested */
  public getTransactionCount(address: string): Promise<number> {
    return this.injectClient((client) => client.getTransactionCount(address));
  }

  /* Tested - @todo Test useMultipleProviders */
  public getTransactionByHash(
    txhash: string,
    useMultipleProviders = false
  ): Promise<TransactionResponse> {
    return this.injectClient((client) => {
      if (!useMultipleProviders) {
        return client.getTransaction(txhash);
      } else {
        const providers = (client as FallbackProvider).providers;
        return any(
          providers.map((p) => {
            // If the node returns undefined, the TX isn't present, but we don't want to resolve the promise with undefined as that would return undefined in the any() promise
            // Instead, we reject if the tx is undefined such that we keep searching in other nodes
            return new Promise((resolve, reject) =>
              p
                .getTransaction(txhash)
                .then((tx) => (tx ? resolve(tx) : reject()))
                .catch((err) => reject(err))
            );
          })
        );
      }
    });
  }

  /* Tested */
  public getTransactionReceipt(txhash: string): Promise<TransactionReceipt> {
    return this.injectClient((client) => client.getTransactionReceipt(txhash));
  }

  public getBlockByHash(blockHash: string): Promise<Block> {
    return this.injectClient((client) => client.getBlock(blockHash, false));
  }

  public getBlockByNumber(blockNumber: number): Promise<Block> {
    return this.injectClient((client) => client.getBlock(blockNumber, false));
  }

  /* Tested */
  public getCurrentBlock(): Promise<string> {
    return this.injectClient((client) => client.getBlockNumber().then((data) => data.toString()));
  }

  public sendRawTx(signedTx: string | ITxSigned): Promise<TransactionResponse> {
    return this.injectClient((client) => client.sendTransaction(signedTx as string));
  }

  public waitForTransaction(txHash: string, confirmations = 1): Promise<TransactionReceipt> {
    return this.injectClient((client) => client.waitForTransaction(txHash, confirmations));
  }

  public getTokenAllowance(
    tokenAddress: string,
    ownerAddress: string,
    spenderAddress: string
  ): Promise<string> {
    return this.injectClient((client) =>
      client
        .call({
          to: tokenAddress,
          data: ERC20.allowance.encodeInput({ _owner: ownerAddress, _spender: spenderAddress })
        })
        .then((data) => ERC20.allowance.decodeOutput(data))
        .then(({ allowance }) => allowance)
    );
  }

  protected injectClient(clientInjectCb: (client: FallbackProvider | BaseProvider) => any) {
    if (clientInjectCb) {
      if (this.isFallbackProvider) {
        return clientInjectCb(ProviderHandler.fetchProvider(this.network));
      }
      return clientInjectCb(ProviderHandler.fetchSingleProvider(this.network));
    }
  }

  public getTokenApprovals(
    tokenAddress: string,
    ownerAddress: string,
  ): Promise<Array<ITokenApprovalLogs>> {
    return this.injectClient((client) =>
      client
        .getLogs({
          fromBlock: "earliest",
          toBlock: "latest",
          address: tokenAddress,
          topics: [
            "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", // keccak('Approval(address,address,uint256)'),
            `0x000000000000000000000000${ownerAddress.substring(2)}` // the token holder address
          ]
        })
        .then((data) => data)
    );
  }
}