import { fAssets, fDWAccounts } from '@fixtures';

import { accountsToCSV } from './csv';

describe('Convert list of accounts to CSV', () => {
  it('convert to CSV', () => {
    const result =
      "address,dpath type,dpath,asset0x982ae6031EBE31e1A01490dd4D3270003d732830,Ledger (ETH),m/44'/60'/0'/0,0.0000ETH0xE8C0F5417B272f2a1C24419bd2cF6B3F584c6b9A,Ledger (ETH),m/44'/60'/0'/1,0.0000ETH";

    const expected = accountsToCSV(fDWAccounts, fAssets[0]);

    // Remove whitepaces from CSV string to avoid jest equality error
    expect(expected.replace(/\s/g, '')).toEqual(result.replace(/\s/g, ''));
  });
});
