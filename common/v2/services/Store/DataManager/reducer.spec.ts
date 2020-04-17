import { LSKeys, IAccount, DSKeys } from 'v2/types';
import { ActionT, ActionV, appDataReducer } from './reducer';

const dispatch = (action: ActionV) => (state: any) => appDataReducer(state, action);

describe('AppStateReducer', () => {
  describe('ADD_ITEM', () => {
    it('can add an Item to an array', () => {
      const account = { address: '0x0', uuid: 'fakeUUID' } as IAccount;
      const prevState = { [LSKeys.ACCOUNTS]: [] };
      const payload = {
        model: LSKeys.ACCOUNTS as DSKeys,
        data: account
      };

      const newState = dispatch({ type: ActionT.ADD_ITEM, payload })(prevState);
      expect(newState[LSKeys.ACCOUNTS]).toContainEqual(account);
    });

    it('preserves the previous items in the array', () => {
      const account1 = { address: '0x1', uuid: 'fakeUUID' } as IAccount;
      const account2 = { address: '0x2', uuid: 'fakeUUID' } as IAccount;
      const prevState = { [LSKeys.ACCOUNTS]: [account1] };
      const payload = {
        model: LSKeys.ACCOUNTS as DSKeys,
        data: account2
      };

      const newState = dispatch({ type: ActionT.ADD_ITEM, payload })(prevState);
      expect(newState[LSKeys.ACCOUNTS].length).toEqual(2);
      expect(newState[LSKeys.ACCOUNTS]).toContainEqual(account2);
    });

    // it('avoids duplicates in the array', () => {
    //   const account1 = { address: '0x1', uuid: 'fakeUUID' } as IAccount;
    //   const account2 = { address: '0x1', uuid: 'fakeUUID' } as IAccount;
    //   const prevState = { [LSKeys.ACCOUNTS]: [account1] };
    //   const payload = {
    //     model: LSKeys.ACCOUNTS,
    //     data: account2
    //   };
    //
    //   const newState = dispatch({ type: ActionT.ADD_ITEM, payload })(prevState);
    //   expect(newState[LSKeys.ACCOUNTS].length).toEqual(1);
    // });
    //
    // it('throws when trying to change SETTINGS', () => {
    //   const prevState = { [LSKeys.SETTINGS]: { dashboardAccounts: ['fakeUUid'] } };
    //   const payload = {
    //     model: LSKeys.SETTINGS,
    //     data: { dashboardAccounts: ['fakeUUID2'] } as ISettings
    //   };
    //
    //   const newState = dispatch({ type: ActionT.ADD_ITEM, payload });
    //   expect(newState.call(prevState)).toThrowError();
    // });
  });

  // describe('DELETE_ITEM', () => {});
  // describe('ADD_ENTRY', () => {});
  // describe('DELETE_ENTRY', () => {});
  // describe('RESET', () => {});
});
