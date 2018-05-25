import {
  setAddressLabel,
  clearAddressLabel,
  setAddressLabelEntry,
  clearAddressLabelEntry
} from './actions';
import { addressBookReducer, INITIAL_STATE } from './reducer';

describe('addressBook: Reducer', () => {
  it('should set an address label', () => {
    expect(
      addressBookReducer(
        undefined,
        setAddressLabel({
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
    const firstState = addressBookReducer(
      undefined,
      setAddressLabel({
        address: '0x0',
        label: 'Foo'
      })
    );

    expect(addressBookReducer(firstState, clearAddressLabel('0x0'))).toEqual(INITIAL_STATE);
  });
  it('should set an address label entry', () => {
    expect(
      addressBookReducer(
        undefined,
        setAddressLabelEntry({
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
    const firstState = addressBookReducer(
      undefined,
      setAddressLabelEntry({
        id: '0',
        address: '0x0',
        temporaryAddress: ' 0x0a',
        addressError: 'Derp',
        label: 'Foo',
        temporaryLabel: 'Food',
        labelError: 'Derp'
      })
    );
    expect(addressBookReducer(firstState, clearAddressLabelEntry('0'))).toEqual(INITIAL_STATE);
  });
});
