import { getInitialState } from 'features/helpers';
import * as addressBookConstants from './constants';
import * as addressBookSelectors from './selectors';

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
    id: addressBookConstants.ADDRESS_BOOK_TABLE_ID
  };
  const accountAddressEntry = {
    ...firstEntry,
    id: addressBookConstants.ACCOUNT_ADDRESS_ID
  };
  const entries = {
    [addressBookConstants.ADDRESS_BOOK_TABLE_ID]: addressBookTableEntry,
    [addressBookConstants.ACCOUNT_ADDRESS_ID]: accountAddressEntry,
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
      expect(addressBookSelectors.getAddressLabels(state)['0x0']).toEqual('Foo');
    });
  });

  describe('getLabelAddresses', () => {
    it('should return a hash of labels to addresses', () => {
      expect(addressBookSelectors.getLabelAddresses(state).Foo).toEqual('0x0');
    });
  });

  describe('getAddressLabelEntry', () => {
    it('should return an address label entry', () => {
      expect(addressBookSelectors.getAddressLabelEntry(state, '1')).toEqual(firstEntry);
    });
  });

  describe('getAddressLabelEntries', () => {
    it('should return all of the address label entries', () => {
      expect(addressBookSelectors.getAddressLabelEntries(state)).toEqual(entries);
    });
  });

  describe('getAddressBookTableEntry', () => {
    it('should return the entry associated with the AddressBook component', () => {
      expect(addressBookSelectors.getAddressBookTableEntry(state)).toEqual(addressBookTableEntry);
    });
  });

  describe('getAccountAddressEntry', () => {
    it('should return the entry associated with the AccountAddress component', () => {
      expect(addressBookSelectors.getAccountAddressEntry(state)).toEqual(accountAddressEntry);
    });
  });

  describe('getAddressLabelEntryFromAddress', () => {
    it('should retrieve an entry with the given address', () => {
      expect(addressBookSelectors.getAddressLabelEntryFromAddress(state, '0x1')).toEqual(
        secondEntry
      );
      expect(addressBookSelectors.getAddressLabelEntryFromAddress(state, '0x2')).toEqual(undefined);
    });
  });

  describe('getAddressLabelRows', () => {
    it('should return an array of non-input entries', () => {
      expect(addressBookSelectors.getAddressLabelRows(state)).toEqual([firstEntry, secondEntry]);
    });
  });

  describe('getNextAddressLabelId', () => {
    it('should return a sequential id based on number of entries', () => {
      expect(addressBookSelectors.getNextAddressLabelId(state)).toEqual('3');
    });
  });
});
