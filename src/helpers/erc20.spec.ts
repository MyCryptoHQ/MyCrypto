import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccount, fDerivedApprovalTx, fRopDAI } from '@fixtures';
import { TAddress } from '@types';
import { inputGasPriceToHex, toTokenBase } from '@utils';

import { formatApproveTx } from './erc20';

describe('formatApproveTx', () => {
  it('formats an approval tx without the gas limit or nonce params', () => {
    const amountToApprove = '5';
    const sender = fAccount.address;
    const spender = repTokenMigrationConfig.toContractAddress;
    const gasPriceHex = inputGasPriceToHex('5');
    const baseAmountToApprove = toTokenBase(amountToApprove, fRopDAI.decimal!);
    const approveTx = formatApproveTx({
      contractAddress: repTokenMigrationConfig.fromContractAddress as TAddress,
      baseTokenAmount: baseAmountToApprove,
      fromAddress: sender,
      spenderAddress: spender as TAddress,
      chainId: 1,
      hexGasPrice: gasPriceHex
    });
    expect(approveTx).toStrictEqual(fDerivedApprovalTx);
  });
});
