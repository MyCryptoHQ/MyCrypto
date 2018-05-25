import { ADDRESS_BOOK } from './types';
import {
  setAddressLabel,
  clearAddressLabel,
  setAddressLabelEntry,
  changeAddressLabelEntry,
  saveAddressLabelEntry,
  clearAddressLabelEntry,
  removeAddressLabelEntry
} from './actions';

describe('addressBook: Actions', () => {
  describe('setAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = {
        address: '0x0',
        label: 'Foo'
      };

      expect(setAddressLabel(payload)).toEqual({
        type: ADDRESS_BOOK.SET_LABEL,
        payload
      });
    });
  });
  describe('clearAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(clearAddressLabel(payload)).toEqual({
        type: ADDRESS_BOOK.CLEAR_LABEL,
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

      expect(setAddressLabelEntry(payload)).toEqual({
        type: ADDRESS_BOOK.SET_LABEL_ENTRY,
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

      expect(changeAddressLabelEntry(payload)).toEqual({
        type: ADDRESS_BOOK.CHANGE_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('saveAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(saveAddressLabelEntry(payload)).toEqual({
        type: ADDRESS_BOOK.SAVE_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('clearAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(clearAddressLabelEntry(payload)).toEqual({
        type: ADDRESS_BOOK.CLEAR_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('removeAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(removeAddressLabelEntry(payload)).toEqual({
        type: ADDRESS_BOOK.REMOVE_LABEL_ENTRY,
        payload
      });
    });
  });
});
