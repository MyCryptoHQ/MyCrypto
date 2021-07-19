import { repTokenMigrationConfig } from '@features/RepTokenMigration/config';
import { fAccount, fDerivedApprovalTx, fNetworks, fRopDAI } from '@fixtures';
import { TAddress } from '@types';
import { inputGasPriceToHex, toTokenBase } from '@utils';

import { formatApproveTx, getTokenInformation } from './erc20';

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

describe('getTokenInformation', () => {
  it('fetches token information for ERC-20 tokens', async () => {
    await expect(
      getTokenInformation(fNetworks[0], '0x6b175474e89094c44da98b954eedeac495271d0f' as TAddress)
    ).resolves.toStrictEqual({
      symbol: 'DAI',
      decimals: 18
    });

    await expect(
      getTokenInformation(fNetworks[0], '0x0000000000000000000000000000000000000000' as TAddress)
    ).resolves.toBeUndefined();
  });
});
