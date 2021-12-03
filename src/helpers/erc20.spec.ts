import { MIGRATION_CONFIGS } from '@features/TokenMigration/config';
import { fAccount, fDerivedApprovalTx, fNetworks, fRopDAI } from '@fixtures';
import { TAddress } from '@types';
import { toTokenBase } from '@utils';

import { formatApproveTx } from './erc20';

describe('formatApproveTx', () => {
  it('formats an approval tx without the gas limit or nonce params', () => {
    const amountToApprove = '5';
    const spender = MIGRATION_CONFIGS.REP.toContractAddress;
    const baseAmountToApprove = toTokenBase(amountToApprove, fRopDAI.decimal!);
    const approveTx = formatApproveTx({
      contractAddress: MIGRATION_CONFIGS.REP.fromContractAddress as TAddress,
      baseTokenAmount: baseAmountToApprove,
      spenderAddress: spender as TAddress,
      form: {
        gasPrice: '5',
        network: fNetworks[0],
        account: fAccount,
        maxFeePerGas: '',
        maxPriorityFeePerGas: '',
        address: '',
        gasLimit: '',
        nonce: ''
      }
    });
    expect(approveTx).toStrictEqual(fDerivedApprovalTx);
  });
});
