import { ethers } from 'ethers';

import { ITxObject } from 'v2/types';
import { inputValueToHex, inputGasPriceToHex, toWei } from 'v2/services/EthService';
import { DEFAULT_NETWORK_CHAINID, DEFAULT_ASSET_DECIMAL } from 'v2/config';
import { UnlockToken, ERC20 } from 'v2/services/EthService/contracts';

import { MembershipSimpleTxFormFull } from './types';
import { MEMBERSHIP_PURCHASE_GAS_LIMIT } from './config';
import { isERC20Tx } from '../SendAssets';

export const createApproveTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const data = ERC20.approve.encodeInput({
    _spender: payload.membershipSelected.contractAddress,
    _value: toWei(payload.membershipSelected.price, DEFAULT_ASSET_DECIMAL)
  });

  return {
    // @ts-ignore Contract Address should be set if asset is ERC20
    to: payload.asset.contractAddress,
    from: payload.account.address,
    data,
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
    to: membershipSelected.contractAddress,
    value: isERC20Tx(payload.asset) ? inputValueToHex('0') : inputValueToHex(payload.amount),
    data,
    gasLimit: MEMBERSHIP_PURCHASE_GAS_LIMIT.toString(),
    gasPrice: inputGasPriceToHex(payload.gasPrice),
    chainId: DEFAULT_NETWORK_CHAINID
  };
};
