import { defaultContacts } from '@database';
import { fAccount, fContacts } from '@fixtures';
import { DataStore, LSKeys } from '@types';
import { values } from '@vendor';

import { migrations } from './persist.config';

describe('Persist Migrations', () => {
  it('3: Updates the MYC_DONATE_ADDRESS in a users persistence layer', () => {
    const migration = migrations['3'];
    const contact = values(defaultContacts)[0];
    const actual = migration({
      [LSKeys.ADDRESS_BOOK]: [{ ...contact, label: 'Deprecated label' }, ...fContacts]
    } as DataStore);
    const expected = { [LSKeys.ADDRESS_BOOK]: [...fContacts, contact] };
    expect(actual).toEqual(expected);
  });

  it('6: Updates the DPath format on accounts', () => {
    const migration = migrations['6'];
    const { path, index, ...account } = fAccount;
    const actual = migration(({
      [LSKeys.ACCOUNTS]: [{ ...account, dPath: "m/44'/60'/0'/0" }]
    } as unknown) as DataStore);
    const expected = { [LSKeys.ACCOUNTS]: [fAccount] };
    expect(actual).toEqual(expected);
  });
});
