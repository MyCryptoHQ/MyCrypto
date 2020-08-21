import { Dispatch } from 'react';

import { TURL } from '@types';

import { getLS, getOrigin } from './helpers';
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

const migrateStorage = (dispatch: Dispatch<MigrateLSAction>) => (
  storage: string | object,
  importFn: (ls: string | object) => boolean
) => {
  // Start loading spinner
  dispatch({ type: Reducer.actionTypes.MIGRATE_REQUEST });
  const success = importFn(storage);
  if (success) {
    dispatch({ type: Reducer.actionTypes.MIGRATE_SUCCESS });
  } else {
    dispatch({ type: Reducer.actionTypes.MIGRATE_FAILURE });
  }
};

const cancelMigration = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.CANCEL_REQUEST });
};

const downloadAndDestroy = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.CANCEL_CONFIRM });
};

const destroySuccess = (dispatch: Dispatch<MigrateLSAction>) => () =>
  dispatch({ type: Reducer.actionTypes.DESTROY_SUCCESS });

const reset = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.RESET });
};

const abortCancel = (dispatch: Dispatch<MigrateLSAction>) => () => {
  dispatch({ type: Reducer.actionTypes.CANCEL_ABORT });
};

export const bindActions = (dispatch: Dispatch<MigrateLSAction>) => ({
  getStorage: getStorage(dispatch),
  migrateStorage: migrateStorage(dispatch),
  cancelMigration: cancelMigration(dispatch),
  downloadAndDestroy: downloadAndDestroy(dispatch),
  abortCancel: abortCancel(dispatch),
  destroySuccess: destroySuccess(dispatch),
  reset: reset(dispatch)
});
