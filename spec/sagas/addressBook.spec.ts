import { runSaga } from 'redux-saga';
import { translateRaw } from 'translations';
import { handleChangeAddressLabelEntry, handleSaveAddressLabelEntry } from 'sagas/addressBook';
import {
  setAddressLabelEntry,
  changeAddressLabelEntry,
  saveAddressLabelEntry
} from 'actions/addressBook';
import { getInitialState } from '../selectors/helpers';

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
  const address = '0x081f37708032d0a7b3622591a8959b213fb47d6f';

  describe('handleChangeAddressLabelEntry', () => {
    it('should successfully change an address label entry with no errors', async () => {
      const action = changeAddressLabelEntry({
        id: '0',
        address,
        label: 'Foo'
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => getState()
        },
        handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        setAddressLabelEntry({
          id: '0',
          address,
          temporaryAddress: address,
          addressError: undefined,
          label: 'Foo',
          temporaryLabel: 'Foo',
          labelError: undefined
        })
      ]);
    });
    it('should change a temporary address and error when an error occurs, but not the address', async () => {
      const action = changeAddressLabelEntry({
        id: '0',
        address: '0', // Invalid ETH address
        label: 'Foo'
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => getState()
        },
        handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        setAddressLabelEntry({
          id: '0',
          address: '',
          temporaryAddress: '0',
          addressError: translateRaw('INVALID_ADDRESS'),
          label: 'Foo',
          temporaryLabel: 'Foo',
          labelError: undefined
        })
      ]);
    });
    it('should change a temporary label and error when an error occurs, but not the label', async () => {
      const action = changeAddressLabelEntry({
        id: '0',
        address,
        label: 'F' // Invalid label length
      });
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => getState()
        },
        handleChangeAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        setAddressLabelEntry({
          id: '0',
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
    it('should successfully overwrite an existing address label entry with no errors', async () => {
      const state = {
        ...getState(),
        addressBook: {
          ...getState().addressBook,
          entries: {
            '0': {
              id: '0',
              address,
              temporaryAddress: address,
              label: 'Foo',
              temporaryLabel: 'Foo'
            }
          }
        }
      };
      const action = saveAddressLabelEntry('0');
      const dispatched: string[] = [];

      await runSaga(
        {
          dispatch: (dispatching: string) => dispatched.push(dispatching),
          getState: () => state
        },
        handleSaveAddressLabelEntry,
        action
      );

      expect(dispatched).toEqual([
        setAddressLabelEntry({
          id: '0',
          address,
          temporaryAddress: address,
          addressError: undefined,
          label: 'Foo',
          temporaryLabel: 'Foo',
          labelError: undefined
        })
      ]);

      // expect(dispatched).toEqual([
      //   setAddressLabelEntry({
      //     id: '0',
      //     address,
      //     temporaryAddress: address,
      //     addressError: undefined,
      //     label: 'Foo',
      //     temporaryLabel: 'Foo',
      //     labelError: undefined
      //   }),
      //   setAddressLabelEntry({
      //     id: 'ADDRESS_BOOK_TABLE_ID',
      //     address: '',
      //     temporaryAddress: '',
      //     addressError: undefined,
      //     label: '',
      //     temporaryLabel: '',
      //     labelError: undefined
      //   })
      // ]);
    });
  });
});
