import { configuredStore } from 'store';
import { addressBook, INITIAL_STATE } from 'reducers/addressBook';
import { addressBookActions } from './';

configuredStore.getState();

describe('addressBook reducer', () => {
  const exampleLabel = {
    address: '0x0',
    label: 'Foo'
  };

  describe('ADD_LABEL_FOR_ADDRESS', () => {
    it('should result in a new entry in a fresh address book', () => {
      expect(addressBook(undefined, addressBookActions.addLabelForAddress(exampleLabel))).toEqual({
        ...INITIAL_STATE,
        labels: {
          '0x0': 'Foo'
        }
      });
    });
    it('should replace an existing entry if the address matches', () => {
      const firstState = addressBook(
        undefined,
        addressBookActions.addLabelForAddress(exampleLabel)
      );
      const nextLabel = {
        address: '0x0',
        label: 'Bar'
      };

      expect(addressBook(firstState, addressBookActions.addLabelForAddress(nextLabel))).toEqual({
        ...firstState,
        labels: {
          '0x0': 'Bar'
        }
      });
    });
  });

  describe('REMOVE_LABEL_FOR_ADDRESS', () => {
    it('should remove a single label from the address book', () => {
      const firstState = addressBook(
        undefined,
        addressBookActions.addLabelForAddress(exampleLabel)
      );

      expect(addressBook(firstState, addressBookActions.removeLabelForAddress('0x0'))).toEqual({
        ...INITIAL_STATE,
        labels: {}
      });
    });
    it('should have no trouble removing a non-existent entry', () => {
      expect(addressBook(undefined, addressBookActions.removeLabelForAddress('0x0'))).toEqual({
        labels: {}
      });
    });
  });
});
