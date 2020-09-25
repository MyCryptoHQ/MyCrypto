import { ethers } from 'ethers';

import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { getAssetByUUID } from '@services';
import { UnlockToken } from '@services/EthService/contracts';
import { ITxConfig, ITxData, ITxObject, ITxToAddress, StoreAccount, TAddress } from '@types';
import {
  formatApproveTx,
  hexToString,
  hexWeiToString,
  inputGasPriceToHex,
  inputValueToHex,
  toWei
} from '@utils';

import { isERC20Asset } from '../SendAssets';
import { IMembershipConfig } from './config';
import { MembershipSimpleTxFormFull } from './types';

export const createApproveTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> =>
  formatApproveTx({
    contractAddress: payload.asset.contractAddress as ITxToAddress,
    baseTokenAmount: toWei(payload.membershipSelected.price, DEFAULT_ASSET_DECIMAL),
    fromAddress: payload.account.address,
    spenderAddress: payload.membershipSelected.contractAddress as TAddress,
    chainId: DEFAULT_NETWORK_CHAINID,
    hexGasPrice: inputGasPriceToHex(payload.gasPrice)
  });

export const createPurchaseTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const membershipSelected = payload.membershipSelected;

  const weiPrice = toWei(membershipSelected.price, DEFAULT_ASSET_DECIMAL);
  const data = UnlockToken.purchase.encodeInput({
    _value: weiPrice,
    _recipient: payload.account.address,
    _referrer: ethers.constants.AddressZero,
    _data: []
  });

  return {
    from: payload.account.address,
    to: membershipSelected.contractAddress as ITxToAddress,
    value: isERC20Asset(payload.asset) ? inputValueToHex('0') : inputValueToHex(payload.amount),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};

export const makePurchaseMembershipTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  membershipSelected: IMembershipConfig
): ITxConfig => {
  const { gasPrice, gasLimit, nonce, data, to, value } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;
  const asset = getAssetByUUID(account.assets)(membershipSelected.assetUUID)!;

  const txConfig: ITxConfig = {
    from: address,
    amount: membershipSelected.price,
    receiverAddress: to,
    senderAccount: account,
    network,
    asset,
    baseAsset,
    gasPrice: hexToString(gasPrice),
    gasLimit: hexToString(gasLimit),
    value: hexWeiToString(value),
    nonce: hexToString(nonce),
    data,
    rawTransaction
  };

  return txConfig;
};
