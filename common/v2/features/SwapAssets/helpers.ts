import { ethers } from 'ethers';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

import { StoreAccount, WalletId, ITxConfig } from 'v2/types';
import { fetchGasPriceEstimates, getGasEstimate } from 'v2/services/ApiService';
import {
  inputGasPriceToHex,
  hexWeiToString,
  getNonce,
  hexToNumber,
  hexToString
} from 'v2/services/EthService';
import { getAssetByUUID, getAssetByTicker } from 'v2/services';
import { ISwapAsset, SigningComponents } from './types';
import {
  SignTransactionPrivateKey,
  SignTransactionWeb3,
  SignTransactionLedger,
  SignTransactionTrezor,
  SignTransactionSafeT,
  SignTransactionKeystore,
  SignTransactionParity,
  SignTransactionMnemonic
} from 'v2/components';

export const WALLET_STEPS: SigningComponents = {
  [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
  [WalletId.METAMASK]: SignTransactionWeb3,
  [WalletId.TRUST]: SignTransactionWeb3,
  [WalletId.CIPHER]: SignTransactionWeb3,
  [WalletId.MIST]: SignTransactionWeb3,
  [WalletId.FRAME]: SignTransactionWeb3,
  [WalletId.LEDGER_NANO_S]: SignTransactionLedger,
  [WalletId.TREZOR]: SignTransactionTrezor,
  [WalletId.SAFE_T_MINI]: SignTransactionSafeT,
  [WalletId.KEYSTORE_FILE]: SignTransactionKeystore,
  [WalletId.PARITY_SIGNER]: SignTransactionParity,
  [WalletId.MNEMONIC_PHRASE]: SignTransactionMnemonic,
  [WalletId.VIEW_ONLY]: null
};

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
  const gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

  const transaction: any = {
    to,
    chainId: network.chainId,
    data: inputData,
    value: 0,
    gasPrice: addHexPrefix(new BN(gasPrice).toString(16))
  };
  transaction.nonce = await getNonce(network, account);
  const gasLimit = await getGasEstimate(network, transaction);
  transaction.gasLimit = hexToNumber(gasLimit);

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
  transaction.from = account.address;
  transaction.gasPrice = addHexPrefix(new BN(gasPrice).toString(16));
  transaction.value = addHexPrefix(new BN(transaction.value).toString(16));
  transaction.chainId = network.chainId;
  transaction.nonce = await getNonce(network, account);
  const gasLimit = await getGasEstimate(network, transaction);
  transaction.gasLimit = hexToNumber(gasLimit) * 1.2; // use slightly higher gas limit than estimate
  delete transaction.from;

  return transaction;
};

export const makeTxConfigFromTransaction = (
  transaction: ITxConfig,
  account: StoreAccount,
  fromAsset: ISwapAsset,
  fromAmount: string
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data } = transaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(network.baseAsset)!;
  const asset = getAssetByTicker(fromAsset.symbol) || baseAsset;

  const txConfig: ITxConfig = {
    from: address,
    amount: fromAmount,
    receiverAddress: address,
    senderAccount: account,
    network,
    asset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit,
    value: fromAmount,
    nonce,
    data,
    rawTransaction: Object.assign({}, transaction, { chainId: network.chainId, to: address })
  };

  return txConfig;
};
