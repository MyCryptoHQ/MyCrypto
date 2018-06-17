import * as actions from './actions';
import * as reducer from './reducer';

describe('addressBook: Reducer', () => {
  it('should set an address label', () => {
    expect(
      reducer.addressBookReducer(
        undefined,
        actions.setAddressLabel({
          address: '0x0',
          label: 'Foo'
        })
      )
    ).toEqual({
      ...reducer.INITIAL_STATE,
      addresses: {
        '0x0': 'Foo'
      },
      labels: {
        Foo: '0x0'
      }
    });
  });
  it('should clear an address label', () => {
    const firstState = reducer.addressBookReducer(
      undefined,
      actions.setAddressLabel({
        address: '0x0',
        label: 'Foo'
      })
    );

    expect(reducer.addressBookReducer(firstState, actions.clearAddressLabel('0x0'))).toEqual(
      reducer.INITIAL_STATE
    );
  });
  it('should set an address label entry', () => {
    expect(
      reducer.addressBookReducer(
        undefined,
        actions.setAddressLabelEntry({
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
      ...reducer.INITIAL_STATE,
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
    const firstState = reducer.addressBookReducer(
      undefined,
      actions.setAddressLabelEntry({
        id: '0',
        address: '0x0',
        temporaryAddress: ' 0x0a',
        addressError: 'Derp',
        label: 'Foo',
        temporaryLabel: 'Food',
        labelError: 'Derp'
      })
    );
    expect(reducer.addressBookReducer(firstState, actions.clearAddressLabelEntry('0'))).toEqual(
      reducer.INITIAL_STATE
    );
  });
});
