import { runSaga } from 'redux-saga';

import { translateRaw } from 'translations';
import { getInitialState } from 'features/helpers';
import * as addressBookConstants from './constants';
import * as addressBookTypes from './types';
import * as addressBookActions from './actions';
import * as addressBookSagas from './sagas';

describe('addressBook: Sagas', () => {
  const initialState = getInitialState();
  const getState = () => ({
    ...initialState,
    addressBook: {
      ...initialState.addressBook,
      addresses: {},
      labels: {},
      entries: {}
    }
  });
  const id = '0';
  const address = '0x081f37708032d0a7b3622591a8959b213fb47d6f';
  const label = 'Foo';

  describe('handleChangeAddressLabelEntry', () => {
    it('should successfully change an address label entry with no errors', async () => {
      const action = addressBookActions.changeAddressLabelEntry({
        id,
        address,
        label
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState
        },
        addressBookSagas.handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        addressBookActions.setAddressLabelEntry({
          id,
          address,
          temporaryAddress: address,
          addressError: undefined,
          label,
          temporaryLabel: label,
          labelError: undefined
        })
      ]);
    });
    it('should change a temporary address and error when an error occurs, but not the address', async () => {
      const action = addressBookActions.changeAddressLabelEntry({
        id,
        address: '0', // Invalid ETH address
        label
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState
        },
        addressBookSagas.handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        addressBookActions.setAddressLabelEntry({
          id,
          address: '',
          temporaryAddress: '0',
          addressError: translateRaw('INVALID_ADDRESS'),
          label,
          temporaryLabel: label,
          labelError: undefined
        })
      ]);
    });
    it('should change a temporary label and error when an error occurs, but not the label', async () => {
      const action = addressBookActions.changeAddressLabelEntry({
        id,
        address,
        label: 'F' // Invalid label length
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => getState()
        },
        addressBookSagas.handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        addressBookActions.setAddressLabelEntry({
          id,
          address,
          temporaryAddress: address,
          addressError: undefined,
          label: '',
          temporaryLabel: 'F',
          labelError: translateRaw('INVALID_LABEL_LENGTH')
        })
      ]);
    });
  });
  describe('handleSaveAddressLabelEntry', () => {
    it('should flash an error without saving when an address or label error exists', async () => {
      const state = {
        ...getState(),
        addressBook: {
          ...getState().addressBook,
          entries: {
            [addressBookConstants.ADDRESS_BOOK_TABLE_ID]: {
              id: addressBookConstants.ADDRESS_BOOK_TABLE_ID,
              address: '0',
              temporaryAddress: '0',
              addressError: translateRaw('INVALID_ADDRESS'),
              label,
              temporaryLabel: label,
              labelError: undefined
            }
          }
        }
      };
      const action = addressBookActions.saveAddressLabelEntry(
        addressBookConstants.ADDRESS_BOOK_TABLE_ID
      );
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        addressBookSagas.handleSaveAddressLabelEntry,
        action
      );

      expect(dispatched.length).toEqual(1);
    });
    it('should successfully create a new entry and clear the temporary entry', async () => {
      const state = {
        ...getState(),
        addressBook: {
          ...getState().addressBook,
          entries: {
            [addressBookConstants.ADDRESS_BOOK_TABLE_ID]: {
              id: addressBookConstants.ADDRESS_BOOK_TABLE_ID,
              address,
              temporaryAddress: address,
              label,
              temporaryLabel: label
            }
          }
        }
      };
      const action = addressBookActions.saveAddressLabelEntry(
        addressBookConstants.ADDRESS_BOOK_TABLE_ID
      );
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        addressBookSagas.handleSaveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        addressBookActions.clearAddressLabel(address),
        addressBookActions.setAddressLabel({
          address,
          label
        }),
        addressBookActions.setAddressLabelEntry({
          id: '1',
          address,
          temporaryAddress: address,
          addressError: undefined,
          label,
          temporaryLabel: label,
          labelError: undefined
        }),
        addressBookActions.setAddressLabelEntry({
          id: addressBookConstants.ADDRESS_BOOK_TABLE_ID,
          address: '',
          temporaryAddress: '',
          addressError: undefined,
          label: '',
          temporaryLabel: '',
          labelError: undefined
        })
      ]);
    });
    it('should successfully overwrite an existing address label entry with no errors', async () => {
      const state = {
        ...getState(),
        addressBook: {
          ...getState().addressBook,
          entries: {
            [id]: {
              id,
              address,
              temporaryAddress: address,
              label,
              temporaryLabel: label
            }
          }
        }
      };
      const action = addressBookActions.saveAddressLabelEntry(id);
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        addressBookSagas.handleSaveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        addressBookActions.clearAddressLabel(address),
        addressBookActions.setAddressLabel({
          address,
          label
        }),
        addressBookActions.setAddressLabelEntry({
          id,
          address,
          temporaryAddress: address,
          addressError: undefined,
          label: 'Foo',
          temporaryLabel: 'Foo',
          labelError: undefined
        })
      ]);
    });
  });
  describe('handleRemoveAddressLabelEntry', () => {
    it('should simply return if the requested entry is non-existent', async () => {
      const action = addressBookActions.removeAddressLabelEntry('Foo');
      const dispatched: addressBookTypes.AddressLabel[] = [];

      await runSaga(
        {
          dispatch: (dispatching: addressBookTypes.AddressLabel) => dispatched.push(dispatching),
          getState: () => getState()
        },
        addressBookSagas.handleRemoveAddressLabelEntry,
        action
      );

      expect(dispatched.length).toEqual(0);
    });
    it('should remove the address, the label, and the entry from the book', async () => {
      const state = {
        ...getState(),
        addressBook: {
          ...getState().addressBook,
          addresses: {
            [address]: label
          },
          labels: {
            label: address
          },
          entries: {
            [id]: {
              id,
              address,
              temporaryAddress: address,
              addressError: undefined,
              label,
              temporaryLabel: label,
              labelError: undefined
            }
          }
        }
      };
      const action = addressBookActions.removeAddressLabelEntry(id);
      const dispatched: addressBookTypes.AddressLabel[] = [];

      await runSaga(
        {
          dispatch: (dispatching: addressBookTypes.AddressLabel) => dispatched.push(dispatching),
          getState: () => state
        },
        addressBookSagas.handleRemoveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        addressBookActions.clearAddressLabel(address),
        addressBookActions.clearAddressLabelEntry(id)
      ]);
    });
  });
});
