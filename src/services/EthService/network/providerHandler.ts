import { FeeData } from '@ethersproject/abstract-provider';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import {
  BaseProvider,
  Block,
  TransactionReceipt,
  TransactionRequest,
  TransactionResponse
} from '@ethersproject/providers';
import { formatEther } from '@ethersproject/units';
import any from '@ungap/promise-any';
import Resolution from '@unstoppabledomains/resolution';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { ERC20 } from '@services/EthService';
import { erc20Abi } from '@services/EthService/contracts/erc20';
import { Asset, ITxObject, ITxSigned, Network, TAddress, TokenInformation } from '@types';
import { baseToConvertedUnit } from '@utils';
import { FallbackProvider } from '@vendor';

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
  private isFallbackProvider: boolean;

  constructor(network: Network, isFallbackProvider = true) {
    this.network = network;
    this.isFallbackProvider = isFallbackProvider;
  }

  public call(txObj: TransactionRequest): Promise<string> {
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
  public async estimateGas(transaction: Partial<ITxObject>): Promise<string> {
    const gasLimit = (await this.getMaxGasLimit(transaction)) ?? transaction.gasLimit;

    return this.injectClient((client) =>
      client.estimateGas({ ...transaction, gasLimit }).then((data) => data.toString())
    );
  }

  public getRawTokenBalance(address: string, token: Asset): Promise<string> {
    return this.injectClient((client) =>
      client
        .call({
          to: token.contractAddress,
          data: ERC20.balanceOf.encodeInput({ _owner: address })
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
        const providers = (client as FallbackProvider).providerConfigs;
        return any(
          providers.map((p) => {
            // If the node returns undefined, the TX isn't present, but we don't want to resolve the promise with undefined as that would return undefined in the any() promise
            // Instead, we reject if the tx is undefined such that we keep searching in other nodes
            return new Promise((resolve, reject) =>
              p.provider
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
    return this.injectClient((client) => client.getBlock(blockHash));
  }

  public getBlockByNumber(blockNumber: number): Promise<Block> {
    return this.injectClient((client) => client.getBlock(blockNumber));
  }

  /* Tested */
  public getLatestBlockNumber(): Promise<string> {
    return this.injectClient((client) => client.getBlockNumber().then((data) => data.toString()));
  }

  public getLatestBlock(): Promise<Block> {
    return this.getBlockByHash('latest');
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

  /**
   * Get token information (symbol, decimals) based on a token address. Returns `undefined` if the information cannot be
   * fetched (e.g. because the provided address is not a contract or the token does not have a symbol or decimals).
   */
  public async getTokenInformation(tokenAddress: TAddress): Promise<TokenInformation | undefined> {
    return this.injectClient(async (client) => {
      try {
        const contract = new Contract(tokenAddress, erc20Abi, client);
        const [symbol, decimals] = await Promise.all([contract.symbol(), contract.decimals()]);

        return { symbol, decimals };
      } catch (e) {
        return undefined;
      }
    });
  }

  public resolveENSName(name: string): Promise<string | null> {
    return this.injectClient((client) => {
      // Use Unstoppable if supported, otherwise is probably an ENS name
      const unstoppable = Resolution.fromEthersProvider(client);
      if (unstoppable.isSupportedDomain(name)) {
        return unstoppable.addr(name, this.network.baseUnit);
      }

      return client.resolveName(name);
    });
  }

  public getFeeData(): Promise<FeeData> {
    return this.injectClient((client) => client.getFeeData());
  }

  // @todo Update this when Ethers supports eth_feeHistory
  public getFeeHistory(
    blockCount: number,
    newestBlock: string,
    rewardPercentiles?: any[]
  ): Promise<{
    baseFeePerGas: string[];
    gasUsedRatio: number[];
    reward?: string[][];
    oldestBlock: number;
  }> {
    return this.injectClient((client) =>
      // @ts-expect-error Temp until Ethers supports eth_feeHistory
      (client as FallbackProvider).providerConfigs[0].provider.send('eth_feeHistory', [
        blockCount,
        newestBlock,
        rewardPercentiles ?? []
      ])
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

  // @todo Remove this when Geth is updated
  private getMaxGasLimit(transaction: Partial<ITxObject>): Promise<BigNumber | undefined> {
    return this.injectClient(async (client) => {
      if (!transaction.from || !transaction.value || transaction.type !== 2) {
        return;
      }

      try {
        const [block, balance] = await Promise.all([
          client.getBlock('latest'),
          await client.getBalance(transaction.from)
        ]);

        const gasPrice = BigNumber.from(transaction.maxFeePerGas);
        const value = BigNumber.from(transaction.value);

        const maxGasLimit = balance.sub(value).div(gasPrice);
        if (maxGasLimit.gt(block.gasLimit)) {
          return block.gasLimit;
        }

        return maxGasLimit;
      } catch {
        return;
      }
    });
  }
}
