import { AddressZero } from '@ethersproject/constants';

import { DEFAULT_ASSET_DECIMAL } from '@config';
import { formatApproveTx } from '@helpers';
import { getAssetByUUID } from '@services';
import { UnlockToken } from '@services/EthService/contracts';
import { ITxConfig, ITxData, ITxObject, ITxToAddress, StoreAccount, TAddress } from '@types';
import { hexToString, hexWeiToString, inputGasPriceToHex, inputValueToHex, toWei } from '@utils';

import { isERC20Asset } from '../SendAssets';
import { IMembershipConfig, IMembershipId, MEMBERSHIP_CONFIG } from './config';
import { MembershipSimpleTxFormFull } from './types';

export const getExpiryDate = (selectedMembership: IMembershipId): Date => {
  const today = Date.now();
  return new Date(today + 86400000 * MEMBERSHIP_CONFIG[selectedMembership].durationInDays);
};

export const createApproveTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> =>
  formatApproveTx({
    contractAddress: payload.asset.contractAddress as ITxToAddress,
    baseTokenAmount: toWei(payload.membershipSelected.price, DEFAULT_ASSET_DECIMAL),
    fromAddress: payload.account.address,
    spenderAddress: payload.membershipSelected.contractAddress as TAddress,
    chainId: payload.network.chainId,
    hexGasPrice: inputGasPriceToHex(payload.gasPrice)
  });

export const createPurchaseTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const membershipSelected = payload.membershipSelected;

  const weiPrice = toWei(membershipSelected.price, DEFAULT_ASSET_DECIMAL);
  const data = UnlockToken.purchase.encodeInput({
    _value: weiPrice,
    _recipient: payload.account.address,
    _referrer: AddressZero,
    _data: []
  });

  return {
    from: payload.account.address,
    to: membershipSelected.contractAddress as ITxToAddress,
    value: isERC20Asset(payload.asset) ? inputValueToHex('0') : inputValueToHex(payload.amount),
    data: data as ITxData,
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: payload.network.chainId
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
