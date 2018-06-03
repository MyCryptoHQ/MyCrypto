import { addressBook, INITIAL_STATE } from 'reducers/addressBook';
import * as addressBookActions from 'actions/addressBook';

describe('addressBook: Reducer', () => {
  it('should set an address label', () => {
    expect(
      addressBook(
        undefined,
        addressBookActions.setAddressLabel({
          address: '0x0',
          label: 'Foo',
          chainId: 1
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
        label: 'Foo',
        chainId: 1
      })
    );

    expect(
      addressBook(
        firstState,
        addressBookActions.clearAddressLabel({ address: '0x0', label: '', chainId: 1 })
      )
    ).toEqual(INITIAL_STATE);
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
          labelError: 'Derp',
          chainId: 1
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
          labelError: 'Derp',
          chainId: 1
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
        labelError: 'Derp',
        chainId: 1
      })
    );
    expect(
      addressBook(
        firstState,
        addressBookActions.clearAddressLabelEntry({ label: '0', address: '', chainId: 1 })
      )
    ).toEqual(INITIAL_STATE);
  });
});
