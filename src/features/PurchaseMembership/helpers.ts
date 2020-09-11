import { ethers } from 'ethers';

import { DEFAULT_ASSET_DECIMAL, DEFAULT_NETWORK_CHAINID } from '@config';
import { getAssetByUUID } from '@services';
import { ERC20, UnlockToken } from '@services/EthService/contracts';
import { ITxConfig, ITxData, ITxObject, ITxToAddress, StoreAccount } from '@types';
import { hexToString, hexWeiToString, inputGasPriceToHex, inputValueToHex, toWei } from '@utils';

import { isERC20Asset } from '../SendAssets';
import { IMembershipConfig } from './config';
import { MembershipSimpleTxFormFull } from './types';

export const createApproveTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const data = ERC20.approve.encodeInput({
    _spender: payload.membershipSelected.contractAddress,
    _value: toWei(payload.membershipSelected.price, DEFAULT_ASSET_DECIMAL)
  });

  return {
    // @ts-ignore Contract Address should be set if asset is ERC20
    to: payload.asset.contractAddress,
    from: payload.account.address,
    data: data as ITxData,
    chainId: DEFAULT_NETWORK_CHAINID,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    value: inputValueToHex('0')
  };
};

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
