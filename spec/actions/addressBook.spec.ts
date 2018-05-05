import {
  TypeKeys,
  addAddressLabel,
  removeAddressLabel,
  setAddressLabelEntry,
  changeAddressLabelEntry,
  saveAddressLabelEntry,
  clearAddressLabelEntry
} from '../../common/actions/addressBook';

describe('addressBook: Actions', () => {
  describe('removeAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = {
        address: '0x0',
        label: 'Foo'
      };

      expect(addAddressLabel(payload)).toEqual({
        type: TypeKeys.ADD_ADDRESS_LABEL,
        payload
      });
    });
  });
  describe('removeAddressLabel', () => {
    it('should generate the correct action', () => {
      const payload = 'Foo';

      expect(removeAddressLabel(payload)).toEqual({
        type: TypeKeys.REMOVE_ADDRESS_LABEL,
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
        type: TypeKeys.SET_ADDRESS_LABEL_ENTRY,
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
        type: TypeKeys.CHANGE_ADDRESS_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('saveAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(saveAddressLabelEntry(payload)).toEqual({
        type: TypeKeys.SAVE_ADDRESS_LABEL_ENTRY,
        payload
      });
    });
  });
  describe('clearAddressLabelEntry', () => {
    it('should generate the correct action', () => {
      const payload = '0';

      expect(clearAddressLabelEntry(payload)).toEqual({
        type: TypeKeys.CLEAR_ADDRESS_LABEL_ENTRY,
        payload
      });
    });
  });
});
