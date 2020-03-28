import { ethers } from 'ethers';

import { ITxObject } from 'v2/types';
import {
  inputValueToHex,
  inputGasPriceToHex,
  toWei
} from 'v2/services/EthService';
import { DEFAULT_NETWORK_CHAINID, DEFAULT_ASSET_DECIMAL } from 'v2/config';

import { MembershipSimpleTxFormFull } from './types';
import { MEMBERSHIP_PURCHASE_GAS_LIMIT } from './config';
import { UnlockToken, ERC20 } from 'v2/services/EthService/contracts';
import { addHexPrefix } from 'ethereumjs-util';
import BN from 'bn.js';
import { isERC20Tx } from '../SendAssets';

export const createSimpleTxObject = (
  formData: MembershipSimpleTxFormFull,
  data: string
): Partial<ITxObject> => {
  return {
    to: formData.address,
    value: isERC20Tx(formData.asset) ? inputValueToHex('0') : inputValueToHex(formData.amount),
    data,
    gasLimit: formData.gasLimit.toString(),
    gasPrice: inputGasPriceToHex(formData.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};

export const createApproveTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const data = ERC20.approve.encodeInput({
    _spender: payload.membershipSelected.contractAddress,
    _value: toWei(payload.membershipSelected.price, DEFAULT_ASSET_DECIMAL)
  });

  return {
    // @ts-ignore Contract Address should be set if asset is ERC20
    to: payload.asset.contractAddress,
    data,
    chainId: 1,
    value: addHexPrefix(new BN('0').toString())
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

  const rawTransaction = createSimpleTxObject(
    {
      ...payload,
      address: membershipSelected.contractAddress,
      gasLimit: MEMBERSHIP_PURCHASE_GAS_LIMIT
    },
    data
  );
  return rawTransaction;
};
