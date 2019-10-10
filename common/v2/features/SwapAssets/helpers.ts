import { ethers } from 'ethers';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { StoreAccount, WalletId, ITxConfig } from 'v2/types';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';
import { inputGasPriceToHex, hexWeiToString, getNonce, hexToNumber } from 'v2/services/EthService';
import { getAssetByUUID, getAssetByTicker } from 'v2/services';
import { ISwapAsset } from './types';

export const makeAllowanceTransaction = async (
  trade: any,
  account: StoreAccount
): Promise<ITxConfig> => {
  const { address: to, spender, amount } = trade.metadata.input;
  const network = account.network;

  // First 4 bytes of the hash of "fee()" for the sighash selector
  const funcHash = ethers.utils.hexDataSlice(ethers.utils.id('approve(address,uint256)'), 0, 4);

  const abi = new ethers.utils.AbiCoder();
  const inputs = [
    {
      name: 'spender',
      type: 'address'
    },
    {
      name: 'amount',
      type: 'uint256'
    }
  ];

  const params = [spender, amount];
  const bytes = abi.encode(inputs, params).substr(2);

  // construct approval data from function hash and parameters
  const inputData = `${funcHash}${bytes}`;

  const { fast } = await fetchGasPriceEstimates(network.id);
  let gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

  if (trade.metadata.gasPrice) {
    gasPrice = trade.metadata.gasPrice;
  }

  const transaction: any = {
    to,
    chainId: network.chainId,
    data: inputData,
    value: '0',
    gasPrice: addHexPrefix(new BN(gasPrice).toString(16))
  };

  if (account.wallet !== WalletId.METAMASK) {
    transaction.nonce = await getNonce(network, account);
    const gasLimit = await getGasEstimate(network, transaction);
    transaction.gasLimit = hexToNumber(gasLimit);
  }

  return transaction;
};

export const makeTradeTransactionFromDexTrade = async (
  trade: any,
  account: StoreAccount
): Promise<ITxConfig> => {
  const network = account.network;
  const { fast } = await fetchGasPriceEstimates(network.id);
  let gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

  if (trade.metadata.gasPrice) {
    gasPrice = trade.metadata.gasPrice;
  }

  const transaction = trade.trade;
  transaction.gasPrice = addHexPrefix(new BN(gasPrice).toString(16));
  transaction.value = addHexPrefix(new BN(transaction.value).toString(16));
  transaction.chainId = network.chainId;

  transaction.nonce = await getNonce(network, account);
  const gasLimit = await getGasEstimate(network, transaction);
  transaction.gasLimit = hexToNumber(gasLimit);

  if (account.wallet !== WalletId.METAMASK && trade.metadata.input) {
    transaction.from = account.address;
  }

  return transaction;
};

export const makeTxConfigFromTransaction = (
  transaction: ITxConfig,
  account: StoreAccount,
  fromAsset: ISwapAsset
): ITxConfig => {
  const { value, gasPrice, gasLimit, nonce, data } = transaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(network.baseAsset)!;
  const asset = getAssetByTicker(fromAsset.symbol) || baseAsset;

  const txConfig: ITxConfig = {
    from: address,
    amount: value,
    receiverAddress: address,
    senderAccount: account,
    network,
    asset,
    baseAsset,
    gasPrice,
    gasLimit,
    value,
    nonce,
    data,
    rawTransaction: Object.assign({}, transaction, { chainId: network.chainId, to: address })
  };

  return txConfig;
};
