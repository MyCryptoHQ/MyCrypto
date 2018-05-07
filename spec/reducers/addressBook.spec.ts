import { addressBook, INITIAL_STATE } from 'reducers/addressBook';
import * as addressBookActions from 'actions/addressBook';

describe('addressBook: Reducer', () => {
  it('should set an address label', () => {
    expect(
      addressBook(
        undefined,
        addressBookActions.setAddressLabel({
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
  it('should clear an address label', () => {
    const firstState = addressBook(
      undefined,
      addressBookActions.setAddressLabel({
        address: '0x0',
        label: 'Foo'
      })
    );

    expect(addressBook(firstState, addressBookActions.clearAddressLabel('0x0'))).toEqual(
      INITIAL_STATE
    );
  });
  it('should set an address label entry', () => {
    expect(
      addressBook(
        undefined,
        addressBookActions.setAddressLabelEntry({
          id: '0',
          address: '0x0',
          temporaryAddress: ' 0x0a',
          addressError: 'Derp',
          label: 'Foo',
          temporaryLabel: 'Food',
          labelError: 'Derp'
        })
      )
    ).toEqual({
      ...INITIAL_STATE,
      entries: {
        0: {
          id: '0',
          address: '0x0',
          temporaryAddress: ' 0x0a',
          addressError: 'Derp',
          label: 'Foo',
          temporaryLabel: 'Food',
          labelError: 'Derp'
        }
      }
    });
  });
  it('should clear an address label entry', () => {
    const firstState = addressBook(
      undefined,
      addressBookActions.setAddressLabelEntry({
        id: '0',
        address: '0x0',
        temporaryAddress: ' 0x0a',
        addressError: 'Derp',
        label: 'Foo',
        temporaryLabel: 'Food',
        labelError: 'Derp'
      })
    );
    expect(addressBook(firstState, addressBookActions.clearAddressLabelEntry('0'))).toEqual(
      INITIAL_STATE
    );
  });
});
