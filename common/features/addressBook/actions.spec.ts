import * as addressBookTypes from './types';
import * as addressBookActions from './actions';

describe('addressBook: Actions', () => {
  describe('setAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = {
        address: '0x0',
        label: 'Foo'
      };

      expect(addressBookActions.setAddressLabel(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.SET_LABEL,
        payload
      });
    });
  });
  describe('clearAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(addressBookActions.clearAddressLabel(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.CLEAR_LABEL,
        payload
      });
    });
  });
  describe('setAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = {
        id: '0',
        address: '0x0',
        addressError: 'Derp',
        label: 'Foo',
        labelError: 'Derp'
      };

      expect(addressBookActions.setAddressLabelEntry(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.SET_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('changeAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = {
        id: '0',
        address: '0x0',
        addressError: 'Derp',
        label: 'Foo',
        labelError: 'Derp'
      };

      expect(addressBookActions.changeAddressLabelEntry(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.CHANGE_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('saveAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(addressBookActions.saveAddressLabelEntry(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.SAVE_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('clearAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(addressBookActions.clearAddressLabelEntry(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.CLEAR_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('removeAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(addressBookActions.removeAddressLabelEntry(payload)).toEqual({
        type: addressBookTypes.AddressBookActions.REMOVE_LABEL_ENTRY,
        payload
      });
    });
  });
});
