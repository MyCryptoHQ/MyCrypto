import { createStore } from 'test-utils';

import { defaultState, default as MigrateLSReducer } from './reducer';

describe('MigrateLSReducer', () => {
  const dispatch = createStore(MigrateLSReducer);

  it('has a default state', () => {
    expect(MigrateLSReducer(defaultState)).toEqual(defaultState);
  });

  it('LOAD_SUCCESS', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.IFRAME_LOAD_SUCCESS,
      payload: {
        frame: '<iframe />',
        storage: JSON.stringify({ foo: 'bar' })
      }
    };
    const state = dispatch(action)(defaultState);
    expect(state.iframeRef).toEqual(action.payload.frame);
    expect(state.storage).toEqual(action.payload.storage);
    expect(state.uiState).toEqual('migrate-prompt');
  });

  it('MIGRATE_REQUEST', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.MIGRATE_REQUEST
    };
    const state = dispatch(action)({ ...defaultState, uiState: 'migrate-prompt' });
    expect(state.isLoading).toEqual(true);
    expect(state.uiState).toEqual('migrate-prompt');
  });

  it('MIGRATE_SUCCESS', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.MIGRATE_SUCCESS
    };
    const state = dispatch(action)({
      ...defaultState,
      iframeRef: ('<iframe />' as any) as HTMLIFrameElement
    });
    expect(state.isLoading).toEqual(false);
    expect(state.canDestroy).toEqual(true);
    expect(state.iframeRef).toBeTruthy();
    expect(state.uiState).toEqual('migrate-success');
  });

  it('MIGRATE_FAILURE', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.MIGRATE_FAILURE
    };
    const state = dispatch(action)({
      ...defaultState,
      iframeRef: ('<iframe />' as any) as HTMLIFrameElement
    });
    expect(state.isLoading).toEqual(false);
    expect(state.canDestroy).toEqual(false);
    expect(state.uiState).toEqual('migrate-error');
  });

  it('CANCEL_REQUEST', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.CANCEL_REQUEST
    };
    const state = dispatch(action)({
      ...defaultState,
      iframeRef: ('<iframe />' as any) as HTMLIFrameElement
    });
    expect(state.uiState).toEqual('confirm-cancel');
  });

  it('CANCEL_ABORT', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.CANCEL_ABORT
    };
    const state = dispatch(action)({
      ...defaultState,
      iframeRef: ('<iframe />' as any) as HTMLIFrameElement
    });
    expect(state.isLoading).toEqual(false);
    expect(state.uiState).toEqual('migrate-prompt');
  });

  it('CANCEL_CONFIRM', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.CANCEL_CONFIRM
    };
    const state = dispatch(action)({
      ...defaultState,
      iframeRef: ('<iframe />' as any) as HTMLIFrameElement
    });
    expect(state.isLoading).toEqual(false);
    expect(state.canDestroy).toEqual(true);
    expect(state.uiState).toEqual('default');
  });

  it('DESTROY_SUCCESS', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.DESTROY_SUCCESS
    };
    const state = dispatch(action)({
      ...defaultState,
      iframeRef: ('<iframe />' as any) as HTMLIFrameElement
    });
    expect(state.isLoading).toEqual(false);
    expect(state.canDestroy).toEqual(false);
    expect(state.uiState).toEqual('default');
  });

  it('RESET', () => {
    const action = {
      type: MigrateLSReducer.actionTypes.RESET
    };
    const state = dispatch(action)(defaultState);
    expect(state).toEqual(defaultState);
  });
});
