import { runSaga } from 'redux-saga';

import { translateRaw } from 'translations';
import * as testHelpers from 'features/testHelpers';
import * as constants from './constants';
import * as types from './types';
import * as actions from './actions';
import * as sagas from './sagas';

describe('addressBook: Sagas', () => {
  const initialState = testHelpers.getInitialState();
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
      const action = actions.changeAddressLabelEntry({
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
        sagas.handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        actions.setAddressLabelEntry({
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
      const action = actions.changeAddressLabelEntry({
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
        sagas.handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        actions.setAddressLabelEntry({
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
      const action = actions.changeAddressLabelEntry({
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
        sagas.handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        actions.setAddressLabelEntry({
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
            [constants.ADDRESS_BOOK_TABLE_ID]: {
              id: constants.ADDRESS_BOOK_TABLE_ID,
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
      const action = actions.saveAddressLabelEntry(constants.ADDRESS_BOOK_TABLE_ID);
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        sagas.handleSaveAddressLabelEntry,
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
            [constants.ADDRESS_BOOK_TABLE_ID]: {
              id: constants.ADDRESS_BOOK_TABLE_ID,
              address,
              temporaryAddress: address,
              label,
              temporaryLabel: label
            }
          }
        }
      };
      const action = actions.saveAddressLabelEntry(constants.ADDRESS_BOOK_TABLE_ID);
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        sagas.handleSaveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        actions.clearAddressLabel(address),
        actions.setAddressLabel({
          address,
          label
        }),
        actions.setAddressLabelEntry({
          id: '1',
          address,
          temporaryAddress: address,
          addressError: undefined,
          label,
          temporaryLabel: label,
          labelError: undefined
        }),
        actions.setAddressLabelEntry({
          id: constants.ADDRESS_BOOK_TABLE_ID,
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
      const action = actions.saveAddressLabelEntry(id);
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        sagas.handleSaveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        actions.clearAddressLabel(address),
        actions.setAddressLabel({
          address,
          label
        }),
        actions.setAddressLabelEntry({
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
      const action = actions.removeAddressLabelEntry('Foo');
      const dispatched: types.AddressLabel[] = [];

      await runSaga(
        {
          dispatch: (dispatching: types.AddressLabel) => dispatched.push(dispatching),
          getState: () => getState()
        },
        sagas.handleRemoveAddressLabelEntry,
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
      const action = actions.removeAddressLabelEntry(id);
      const dispatched: types.AddressLabel[] = [];

      await runSaga(
        {
          dispatch: (dispatching: types.AddressLabel) => dispatched.push(dispatching),
          getState: () => state
        },
        sagas.handleRemoveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        actions.clearAddressLabel(address),
        actions.clearAddressLabelEntry(id)
      ]);
    });
  });
});
