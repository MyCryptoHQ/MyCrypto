import { createStore } from 'test-utils';
import { default as MigrateLSReducer, defaultState } from './reducer';

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
    const state = dispatch(action)(defaultState);
    expect(state.isLoading).toEqual(false);
    expect(state.canDestroy).toEqual(true);
    expect(state.uiState).toEqual('migrate-success');
  });
});
