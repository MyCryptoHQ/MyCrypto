import { Dispatch } from 'react';

import { TURL } from '@types';

import { getLS, getOrigin, DBName } from './helpers';
import { default as Reducer, MigrateLSAction } from './reducer';

const getStorage = (dispatch: Dispatch<MigrateLSAction>) => (
  frame: HTMLIFrameElement,
  src: TURL,
  validate: (ls: string) => boolean
) => {
  const storage = getLS(frame);
  const origin = getOrigin(frame);

  if (origin === src && storage && validate(storage)) {
    dispatch({
      type: Reducer.actionTypes.IFRAME_LOAD_SUCCESS,
      payload: { frame, storage }
    });
  }
};

const destroyStorage = (dispatch: Dispatch<MigrateLSAction>) => (frame: HTMLIFrameElement) => {
  frame.contentWindow?.localStorage.removeItem(DBName);
  dispatch({
    type: Reducer.actionTypes.RESET
  });
};

const migrateStorage = (dispatch: Dispatch<MigrateLSAction>) => (
  storage: string,
  importFn: (ls: string) => boolean
) => {
  // Start loading spinner
  dispatch({ type: Reducer.actionTypes.MIGRATE_REQUEST });
  try {
    const success = importFn(storage);
    if (success) {
      dispatch({ type: Reducer.actionTypes.MIGRATE_SUCCESS });
    } else {
      throw new Error(`[MYC-Migrate] Import failed`);
    }
    // destroyStorage(state.iframeRef);
  } catch (err) {
    dispatch({ type: Reducer.actionTypes.MIGRATE_FAILURE, payload: { error: err } });
  }
};

const cancelMigration = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.CANCEL_REQUEST });
};

const downloadAndDestroy = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.CANCEL_CONFIRM });
};

const abortCancel = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.CANCEL_ABORT });
};

export const bindActions = (dispatch: Dispatch<MigrateLSAction>) => ({
  getStorage: getStorage(dispatch),
  destroyStorage: destroyStorage(dispatch),
  migrateStorage: migrateStorage(dispatch),
  cancelMigration: cancelMigration(dispatch),
  downloadAndDestroy: downloadAndDestroy(dispatch),
  abortCancel: abortCancel(dispatch)
});
