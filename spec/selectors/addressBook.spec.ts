import {
  getAddressLabels,
  getLabelAddresses,
  getAddressLabelEntry,
  getAddressLabelEntries,
  getAddressBookTableEntry,
  getAccountAddressEntry,
  getAddressLabelEntryFromAddress,
  getAddressLabelRows,
  getNextAddressLabelId
} from 'selectors/addressBook';
import { getInitialState } from './helpers';

describe('addressBook: Selectors', () => {
  const initialState = getInitialState();
  const firstEntry = {
    id: '1',
    address: '0x0',
    temporaryAddress: '0x0',
    addressError: 'Derp',
    label: 'Foo',
    temporaryLabel: 'Foo',
    labelError: 'Derp'
  };
  const secondEntry = {
    ...firstEntry,
    id: '2',
    address: '0x1',
    temporaryAddress: '0x1'
  };
  const addressBookTableEntry = {
    ...firstEntry,
    id: 'ADDRESS_BOOK_TABLE_ID'
  };
  const accountAddressEntry = {
    ...firstEntry,
    id: 'ACCOUNT_ADDRESS_ID'
  };
  const entries = {
    ADDRESS_BOOK_TABLE_ID: addressBookTableEntry,
    ACCOUNT_ADDRESS_ID: accountAddressEntry,
    '1': firstEntry,
    '2': secondEntry
  };
  const state: any = {
    ...initialState,
    addressBook: {
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      },
      entries
    }
  };

  describe('getAddressLabels', () => {
    it('should return a hash of addresses to labels', () => {
      expect(getAddressLabels(state)['0x0']).toEqual('Foo');
    });
  });

  describe('getLabelAddresses', () => {
    it('should return a hash of labels to addresses', () => {
      expect(getLabelAddresses(state).Foo).toEqual('0x0');
    });
  });

  describe('getAddressLabelEntry', () => {
    it('should return an address label entry', () => {
      expect(getAddressLabelEntry(state, '1')).toEqual(firstEntry);
    });
  });

  describe('getAddressLabelEntries', () => {
    it('should return all of the address label entries', () => {
      expect(getAddressLabelEntries(state)).toEqual(entries);
    });
  });

  describe('getAddressBookTableEntry', () => {
    it('should return the entry associated with the AddressBook component', () => {
      expect(getAddressBookTableEntry(state)).toEqual(addressBookTableEntry);
    });
  });

  describe('getAccountAddressEntry', () => {
    it('should return the entry associated with the AccountAddress component', () => {
      expect(getAccountAddressEntry(state)).toEqual(accountAddressEntry);
    });
  });

  describe('getAddressLabelEntryFromAddress', () => {
    it('should retrieve an entry with the given address', () => {
      expect(getAddressLabelEntryFromAddress(state, '0x1')).toEqual(secondEntry);
      expect(getAddressLabelEntryFromAddress(state, '0x2')).toEqual(undefined);
    });
  });

  describe('getAddressLabelRows', () => {
    it('should return an array of non-input entries', () => {
      expect(getAddressLabelRows(state)).toEqual([firstEntry, secondEntry]);
    });
  });

  describe('getNextAddressLabelId', () => {
    it('should return a sequential id based on number of entries', () => {
      expect(getNextAddressLabelId(state)).toEqual('3');
    });
  });
});
