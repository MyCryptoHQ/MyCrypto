import { AddressZero } from '@ethersproject/constants';

import { DEFAULT_ASSET_DECIMAL, donationAddressMap } from '@config';
import { formatApproveTx, makeTxFromForm } from '@helpers';
import { getAssetByUUID } from '@services';
import { UnlockToken } from '@services/EthService/contracts';
import { ITxConfig, ITxData, ITxObject, ITxToAddress, StoreAccount, TAddress } from '@types';
import { toWei } from '@utils';

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
    baseTokenAmount: toWei(
      payload.membershipSelected.price,
      payload.asset.decimal ?? DEFAULT_ASSET_DECIMAL
    ),
    spenderAddress: payload.membershipSelected.contractAddress as TAddress,
    form: payload
  });

export const createPurchaseTx = (payload: MembershipSimpleTxFormFull): Partial<ITxObject> => {
  const membershipSelected = payload.membershipSelected;

  const weiPrice = toWei(membershipSelected.price, payload.asset.decimal ?? DEFAULT_ASSET_DECIMAL);
  // Referrals are disabled for now as per Unlock advice - usually we only want referrals enabled on cheaper networks since the referral logic adds to the gas cost
  const useReferral = false;
  const data = UnlockToken.purchase.encodeInput({
    _value: weiPrice,
    _recipient: payload.account.address,
    _referrer: useReferral ? donationAddressMap.ETH : AddressZero,
    _data: []
  }) as ITxData;

  const value = isERC20Asset(payload.asset) ? '0' : payload.amount;

  const { gasLimit, nonce, ...tx } = makeTxFromForm(
    { ...payload, address: membershipSelected.contractAddress as ITxToAddress },
    value,
    data
  );
  return tx;
};

export const makePurchaseMembershipTxConfig = (
  rawTransaction: ITxObject,
  account: StoreAccount,
  membershipSelected: IMembershipConfig
): ITxConfig => {
  const { to } = rawTransaction;
  const { address, network } = account;
  const baseAsset = getAssetByUUID(account.assets)(network.baseAsset)!;
  const asset = getAssetByUUID(account.assets)(membershipSelected.assetUUID)!;

  const txConfig: ITxConfig = {
    from: address,
    amount: membershipSelected.price,
    receiverAddress: to,
    senderAccount: account,
    networkId: network.id,
    asset,
    baseAsset,
    rawTransaction
  };

  return txConfig;
};
