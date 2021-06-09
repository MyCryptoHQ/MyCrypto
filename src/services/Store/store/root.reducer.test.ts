import { call, put } from 'redux-saga-test-plan/matchers';
import { expectSaga, mockAppState } from 'test-utils';

import { fLocalStorage } from '@fixtures';
import { marshallState } from '@services/Store/DataManager/utils';
import { omit } from '@vendor';

import importSlice from './import.slice';
import { APP_PERSIST_CONFIG, migrate } from './persist.config';
import { appReset, exportState, importSaga, importState } from './root.reducer';

describe('Import - Export', () => {
  it('exportState(): returns the persistable state as a deMarshalled string', () => {
    const expected = fLocalStorage;
    const actual = exportState(mockAppState());
    expect(omit(['mtime'], actual)).toEqual(omit(['mtime'], expected));
  });

  it('importSaga(): updates the app state with the provided data', async () => {
    const importable = JSON.stringify(fLocalStorage);
    const migrated = await migrate(
      // @ts-expect-error: We don't provide _persist object to migrate
      marshallState(JSON.parse(importable)),
      APP_PERSIST_CONFIG.version!
    );
    return expectSaga(importSaga)
      .withState(mockAppState())
      .dispatch(importState(importable))
      .silentRun()
      .then(({ effects }) => {
        expect(effects.put).toHaveLength(3);
        expect(effects.call[0]).toEqual(
          call(migrate, marshallState(JSON.parse(importable)), APP_PERSIST_CONFIG.version!)
        );
        expect(effects.put[1]).toEqual(put(appReset(migrated)));
        expect(effects.put[2]).toEqual(put(importSlice.actions.success()));
      });
  });

  it('importSaga(): sets error state on failure', () => {
    const errorMessage = new TypeError('Cannot convert undefined or null to object');
    const importable = JSON.stringify({ foo: 'made to fail' });
    return expectSaga(importSaga)
      .withState(mockAppState())
      .put(importSlice.actions.error(errorMessage))
      .dispatch(importState(importable))
      .silentRun();
  });
});
