import { runSaga } from 'redux-saga';
import { handleChangeAddressLabelEntry, handleSaveAddressLabelEntry } from 'sagas/addressBook';
import {
  addAddressLabel,
  setAddressLabelEntry,
  changeAddressLabelEntry,
  saveAddressLabelEntry,
  clearAddressLabelEntry
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
          addressError: undefined,
          label: 'Foo',
          labelError: undefined
        })
      ]);
    });
  });
  describe('handleSaveAddressLabelEntry', () => {
    it('should successfully save an address label entry with no errors', async () => {
      const state = {
        ...getState(),
        addressBook: {
          ...getState().addressBook,
          entries: {
            '0': {
              address,
              label: 'Foo'
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
        addAddressLabel({
          address,
          label: 'Foo'
        }),
        clearAddressLabelEntry('0')
      ]);
    });
  });
});
