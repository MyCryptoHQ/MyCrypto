import * as types from './types';
import * as actions from './actions';

describe('addressBook: Actions', () => {
  describe('setAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = {
        address: '0x0',
        label: 'Foo'
      };

      expect(actions.setAddressLabel(payload)).toEqual({
        type: types.AddressBookActions.SET_LABEL,
        payload
      });
    });
  });
  describe('clearAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(actions.clearAddressLabel(payload)).toEqual({
        type: types.AddressBookActions.CLEAR_LABEL,
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

      expect(actions.setAddressLabelEntry(payload)).toEqual({
        type: types.AddressBookActions.SET_LABEL_ENTRY,
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

      expect(actions.changeAddressLabelEntry(payload)).toEqual({
        type: types.AddressBookActions.CHANGE_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('saveAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(actions.saveAddressLabelEntry(payload)).toEqual({
        type: types.AddressBookActions.SAVE_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('clearAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(actions.clearAddressLabelEntry(payload)).toEqual({
        type: types.AddressBookActions.CLEAR_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('removeAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(actions.removeAddressLabelEntry(payload)).toEqual({
        type: types.AddressBookActions.REMOVE_LABEL_ENTRY,
        payload
      });
    });
  });
});
