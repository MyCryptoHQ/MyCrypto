import * as addressBookActions from './actions';
import * as addressBookReducer from './reducer';

describe('addressBook: Reducer', () => {
  it('should set an address label', () => {
    expect(
      addressBookReducer.addressBookReducer(
        undefined,
        addressBookActions.setAddressLabel({
          address: '0x0',
          label: 'Foo'
        })
      )
    ).toEqual({
      ...addressBookReducer.INITIAL_STATE,
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      }
    });
  });
  it('should clear an address label', () => {
    const firstState = addressBookReducer.addressBookReducer(
      undefined,
      addressBookActions.setAddressLabel({
        address: '0x0',
        label: 'Foo'
      })
    );

    expect(
      addressBookReducer.addressBookReducer(firstState, addressBookActions.clearAddressLabel('0x0'))
    ).toEqual(addressBookReducer.INITIAL_STATE);
  });
  it('should set an address label entry', () => {
    expect(
      addressBookReducer.addressBookReducer(
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
      ...addressBookReducer.INITIAL_STATE,
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
    const firstState = addressBookReducer.addressBookReducer(
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
    expect(
      addressBookReducer.addressBookReducer(
        firstState,
        addressBookActions.clearAddressLabelEntry('0')
      )
    ).toEqual(addressBookReducer.INITIAL_STATE);
  });
});
