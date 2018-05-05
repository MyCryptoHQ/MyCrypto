import { addressBook, INITIAL_STATE } from 'reducers/addressBook';
import * as addressBookActions from 'actions/addressBook';

describe('addressBook: Reducer', () => {
  it('should add an address label', () => {
    expect(
      addressBook(
        undefined,
        addressBookActions.addAddressLabel({
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
      }
    });
  });

  it('should remove an existing address label', () => {
    const state = {
      ...INITIAL_STATE,
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      }
    };

    expect(addressBook(undefined, addressBookActions.removeAddressLabel('0x0'))).toEqual({
      ...state,
      addresses: {},
      labels: {}
    });
  });

  it('should set an address label entry', () => {
    expect(
      addressBook(
        undefined,
        addressBookActions.setAddressLabelEntry({
          id: '0',
          address: '0x0',
          addressError: 'Derp',
          label: 'Foo',
          labelError: 'Derp'
        })
      )
    ).toEqual({
      ...INITIAL_STATE,
      entries: {
        0: {
          address: '0x0',
          addressError: 'Derp',
          label: 'Foo',
          labelError: 'Derp'
        }
      }
    });
  });
});
