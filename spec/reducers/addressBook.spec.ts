import { addressBook, INITIAL_STATE } from 'reducers/addressBook';
import * as addressBookActions from 'actions/addressBook';

describe('addressBook: Reducer', () => {
  describe('Adding an address label: Suceeded', () => {
    it('should add a new entry into both "addresses" and "labels", as well as removing any errors', () => {
      expect(
        addressBook(
          undefined,
          addressBookActions.addAddressLabelSucceeded({
            index: '1337',
            address: '0x0',
            label: 'Foo'
          })
        )
      ).toEqual({
        ...INITIAL_STATE,
        addresses: {
          '0x0': 'Foo'
        },
        labels: {
          Foo: '0x0'
        },
        addressErrors: {
          '0x0': undefined
        },
        labelErrors: {
          Foo: undefined
        }
      });
    });
  });
  describe('Adding an address label: Failed', () => {
    it('should add a new entry into addressErrors when the error is an addressError', () => {
      expect(
        addressBook(
          undefined,
          addressBookActions.addAddressLabelFailed({
            index: '1337',
            addressError: 'Foo bar baz.'
          })
        )
      ).toEqual({
        ...INITIAL_STATE,
        addresses: {},
        labels: {},
        addressErrors: {
          '1337': 'Foo bar baz.'
        },
        labelErrors: {}
      });
    });
    it('should add a new entry into labelErrors when the error is a labelError', () => {
      expect(
        addressBook(
          undefined,
          addressBookActions.addAddressLabelFailed({
            index: '1337',
            labelError: 'Foo bar baz.'
          })
        )
      ).toEqual({
        ...INITIAL_STATE,
        addresses: {},
        labels: {},
        addressErrors: {},
        labelErrors: {
          '1337': 'Foo bar baz.'
        }
      });
    });
  });
  describe('Removing an address label', () => {
    const state = {
      ...INITIAL_STATE,
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      }
    };

    it('should remove an existing label from addresses and labels', () => {
      expect(addressBook(undefined, addressBookActions.removeAddressLabel('0x0'))).toEqual({
        ...state,
        addresses: {},
        labels: {}
      });
    });
  });
});
