import { AppState } from '@store';
import { expectSaga } from 'test-utils';

import { APP_STATE, fLocalStorage } from '@fixtures';
import { marshallState } from '@services/Store/DataManager/utils';
import { omit } from '@vendor';

import { dbReset } from './database.slice';
import importSlice from './import.slice';
import { exportState, importSaga, importState } from './root.reducer';

describe('Import - Export', () => {
  it('exportState(): returns the persistable state as a deMarshalled string', () => {
    const expected = fLocalStorage;
    const actual = exportState(({ legacy: APP_STATE } as unknown) as AppState);
    expect(omit(['mtime'], actual)).toEqual(omit(['mtime'], expected));
  });

  it('importSaga(): updates the app state with the provided data', () => {
    const importable = JSON.stringify(fLocalStorage);
    return expectSaga(importSaga)
      .withState({ legacy: APP_STATE })
      .put(dbReset(marshallState(fLocalStorage)))
      .dispatch(importState(importable))
      .silentRun();
  });

  it('importSaga(): sets error state on failure', () => {
    const errorMessage = new Error('Invalid import file');
    const importable = JSON.stringify({ foo: 'made to fail' });
    return expectSaga(importSaga)
      .withState({ legacy: APP_STATE })
      .put(importSlice.actions.error(errorMessage))
      .dispatch(importState(importable))
      .silentRun();
  });
});
