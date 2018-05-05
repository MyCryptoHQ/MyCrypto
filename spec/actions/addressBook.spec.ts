import {
  TypeKeys,
  addAddressLabelRequested,
  addAddressLabelSucceeded,
  addAddressLabelFailed,
  removeAddressLabel
} from '../../common/actions/addressBook';

describe('addressBook: Actions', () => {
  describe('addAddressLabelRequested', () => {
    it('should generate the correct action', () => {
      const payload = {
        index: 0,
        address: '0x0',
        label: 'Foo'
      };

      expect(addAddressLabelRequested(payload)).toEqual({
        type: TypeKeys.ADD_ADDRESS_LABEL_REQUESTED,
        payload
      });
    });
  });
  describe('addAddressLabelSucceeded', () => {
    it('should generate the correct action', () => {
      const payload = {
        index: 0,
        address: '0x0',
        label: 'Foo'
      };

      expect(addAddressLabelSucceeded(payload)).toEqual({
        type: TypeKeys.ADD_ADDRESS_LABEL_SUCCEEDED,
        payload
      });
    });
  });
  describe('addAddressLabelFailed', () => {
    it('should generate the correct action', () => {
      const payload = {
        index: 0,
        addressError: 'Foo bar baz.'
      };

      expect(addAddressLabelFailed(payload)).toEqual({
        type: TypeKeys.ADD_ADDRESS_LABEL_FAILED,
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
});
