import { expectSaga, mockAppState } from 'test-utils';

import { fAccount, fSettings } from '@fixtures';

import { createAccounts, destroyAccount } from './account.slice';
import slice, {
  deleteAccount,
  deleteAccountWorker,
  initialState,
  restoreAccount,
  restoreAccountWorker
} from './accountUndo.slice';
import { deleteMembership, fetchMemberships } from './membership.slice';
import { addCurrent, resetCurrentsTo } from './settings.slice';

const reducer = slice.reducer;
const { add, remove } = slice.actions;

describe('AccountUndoSlice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('add(): adds account to cache', () => {
    const actual = reducer(initialState, add(fAccount));
    const expected = [fAccount];
    expect(actual).toEqual(expected);
  });

  it('remove(): removes account from cache', () => {
    const actual = reducer([fAccount], remove(fAccount.uuid));
    expect(actual).toEqual([]);
  });
});

describe('restoreAccountWorker()', () => {
  it('restores account based on uuid', () => {
    const uuid = fAccount.uuid;
    return expectSaga(restoreAccountWorker, restoreAccount(uuid))
      .withState({ accountUndo: [fAccount] })
      .put(createAccounts([fAccount]))
      .put(addCurrent(uuid))
      .put(fetchMemberships([fAccount]))
      .put(remove(uuid))
      .silentRun();
  });
});

describe('deleteAccountWorker()', () => {
  it('deletes account and puts it in cache', () => {
    return expectSaga(deleteAccountWorker, deleteAccount(fAccount))
      .withState({
        ...mockAppState({ settings: { ...fSettings, dashboardAccounts: [fAccount.uuid] } }),
        accountUndo: []
      })
      .put(add(fAccount))
      .put(destroyAccount(fAccount.uuid))
      .put(resetCurrentsTo([]))
      .put(deleteMembership({ address: fAccount.address, networkId: fAccount.networkId }))
      .silentRun();
  });
});
