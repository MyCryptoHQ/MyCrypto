import { TURL } from '@types';

import { bindActions } from './actions';
import { DBName } from './helpers';
import { default as Reducer } from './reducer';

describe('MigrateLS actions', () => {
  test('reset()', () => {
    const dispatch = jest.fn();
    const { reset } = bindActions(dispatch);
    reset();
    expect(dispatch).toHaveBeenCalledWith({ type: Reducer.actionTypes.RESET });
  });

  test('destroySuccess()', () => {
    const dispatch = jest.fn();
    const { destroySuccess } = bindActions(dispatch);
    destroySuccess();
    expect(dispatch).toHaveBeenCalledWith({ type: Reducer.actionTypes.DESTROY_SUCCESS });
  });

  test('abortCancel()', () => {
    const dispatch = jest.fn();
    const { abortCancel } = bindActions(dispatch);
    abortCancel();
    expect(dispatch).toHaveBeenCalledWith({ type: Reducer.actionTypes.CANCEL_ABORT });
  });

  test('cancelMigration()', () => {
    const dispatch = jest.fn();
    const { cancelMigration } = bindActions(dispatch);
    cancelMigration();
    expect(dispatch).toHaveBeenCalledWith({ type: Reducer.actionTypes.CANCEL_REQUEST });
  });

  test('migrateStorage()', () => {
    const dispatch = jest.fn();
    const { migrateStorage } = bindActions(dispatch);
    migrateStorage({ version: 'dummy' }, () => false);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: Reducer.actionTypes.MIGRATE_REQUEST });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: Reducer.actionTypes.MIGRATE_FAILURE });
  });

  test('migrateStorage', () => {
    const dispatch = jest.fn();
    const { migrateStorage } = bindActions(dispatch);
    migrateStorage({ version: 'dummy' }, () => true);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: Reducer.actionTypes.MIGRATE_REQUEST });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: Reducer.actionTypes.MIGRATE_SUCCESS });
  });

  test('getStorage()', () => {
    const dispatch = jest.fn();
    const { getStorage } = bindActions(dispatch);
    const frame = ({
      contentWindow: {
        localStorage: { [DBName]: { foo: 'bar' } },
        location: {
          origin: 'test-origin'
        }
      }
    } as any) as HTMLIFrameElement;
    getStorage(frame, 'test-origin' as TURL, () => true);

    expect(dispatch).toHaveBeenCalledWith({
      type: Reducer.actionTypes.IFRAME_LOAD_SUCCESS,
      payload: { frame, storage: frame.contentWindow?.localStorage[DBName] }
    });
  });

  test('getStorage() fails with wrong origin', () => {
    const dispatch = jest.fn();
    const { getStorage } = bindActions(dispatch);
    const frame = ({
      contentWindow: {
        localStorage: { [DBName]: { foo: 'bar' } },
        location: {
          origin: 'invalid-origin'
        }
      }
    } as any) as HTMLIFrameElement;
    getStorage(frame, 'app-origin' as TURL, () => true);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('getStorage() fails with wrong DB key', () => {
    const dispatch = jest.fn();
    const { getStorage } = bindActions(dispatch);
    const frame = ({
      contentWindow: {
        localStorage: { ['another-key']: { foo: 'bar' } },
        location: {
          origin: 'invalid-origin'
        }
      }
    } as any) as HTMLIFrameElement;
    getStorage(frame, 'app-origin' as TURL, () => true);
    expect(dispatch).not.toHaveBeenCalled();
  });

  test('getStorage() fails with wrong if invalid storage', () => {
    const dispatch = jest.fn();
    const { getStorage } = bindActions(dispatch);
    const frame = ({
      contentWindow: {
        localStorage: { ['another-key']: { foo: 'bar' } },
        location: {
          origin: 'invalid-origin'
        }
      }
    } as any) as HTMLIFrameElement;
    getStorage(frame, 'app-origin' as TURL, () => false);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
