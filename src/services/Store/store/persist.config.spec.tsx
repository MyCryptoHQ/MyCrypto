import { defaultContacts } from '@database';
import { fContacts } from '@fixtures';
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
});
