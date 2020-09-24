import { donationAddressMap } from '@config';
import { fAccount, fRopDAI } from '@fixtures';
import { TAddress } from '@types';
import { inputGasPriceToHex, toTokenBase } from '@utils';

import { formatApproveTx } from './erc20';

describe('formatApproveTx', () => {
  it('formats an approval tx without the gas limit or nonce params', () => {
    const amountToApprove = '5';
    const sender = fAccount.address;
    const spender = donationAddressMap.ETH;
    const gasPriceHex = inputGasPriceToHex('5');
    const baseAmountToApprove = toTokenBase(amountToApprove, fRopDAI.decimal);
    const approveTx = formatApproveTx(
      fRopDAI.contractAddress as TAddress,
      baseAmountToApprove,
      sender,
      spender as TAddress,
      1,
      gasPriceHex
    );
    expect(approveTx).toStrictEqual({
      chainId: 1,
      data:
        '0x095ea7b30000000000000000000000004bbeeb066ed09b7aed07bf39eee0460dfa2615200000000000000000000000000000000000000000000000004563918244f40000',
      from: '0xfE5443FaC29fA621cFc33D41D1927fd0f5E0bB7c',
      gasPrice: '0x12a05f200',
      to: '0xad6d458402f60fd3bd25163575031acdce07538d',
      value: '0x0'
    });
  });
});
