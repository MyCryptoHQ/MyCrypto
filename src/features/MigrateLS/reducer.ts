import { TAction } from '@types';

export type UIStates =
  | 'default'
  | 'migrate-prompt'
  | 'migrate-success'
  | 'migrate-error'
  | 'confirm-cancel'
  | 'confirm-success';

interface State {
  readonly iframeRef?: HTMLIFrameElement;
  readonly storage?: string;
  readonly isLoading: boolean;
  readonly canDestroy: boolean;
  readonly canReset: boolean;
  readonly uiState: UIStates;
}

export const defaultState: State = {
  storage: undefined,
  iframeRef: undefined,
  uiState: 'default',
  isLoading: false,
  canDestroy: false,
  canReset: false
};

export type MigrateLSAction = TAction<string, any>;

const MigrateLSReducer = (state: State, action?: MigrateLSAction): State => {
  const { type, payload } = action || {};
  switch (type) {
    case MigrateLSReducer.actionTypes.IFRAME_LOAD_SUCCESS:
      return {
        ...state,
        uiState: 'migrate-prompt',
        iframeRef: payload.frame,
        storage: payload.storage
      };
    case MigrateLSReducer.actionTypes.MIGRATE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case MigrateLSReducer.actionTypes.MIGRATE_SUCCESS: {
      return {
        ...state,
        uiState: 'migrate-success',
        isLoading: false,
        canDestroy: true
      };
    }
    case MigrateLSReducer.actionTypes.MIGRATE_FAILURE: {
      return {
        ...state,
        uiState: 'migrate-error',
        isLoading: false
      };
    }
    case MigrateLSReducer.actionTypes.CANCEL_REQUEST: {
      return {
        ...state,
        uiState: 'confirm-cancel'
      };
    }
    case MigrateLSReducer.actionTypes.CANCEL_ABORT: {
      return {
        ...state,
        uiState: 'migrate-prompt'
      };
    }
    case MigrateLSReducer.actionTypes.CANCEL_CONFIRM: {
      return {
        ...state,
        uiState: 'default',
        canDestroy: true
      };
    }
    case MigrateLSReducer.actionTypes.DESTROY_SUCCESS: {
      return {
        ...state,
        uiState: 'default',
        canDestroy: false,
        canReset: true
      };
    }
    case MigrateLSReducer.actionTypes.RESET:
    default:
      return defaultState;
  }
};

MigrateLSReducer.actionTypes = {
  IFRAME_LOAD_SUCCESS: 'IFRAME_LOAD_SUCCESS',

  MIGRATE_REQUEST: 'MIGRATE_REQUEST',
  MIGRATE_SUCCESS: 'MIGRATE_SUCCESS',
  MIGRATE_FAILURE: 'MIGRATE_FAILURE',

  CANCEL_REQUEST: 'CANCEL_REQUEST',
  CANCEL_CONFIRM: 'CANCEL_CONFIRM',
  CANCEL_ABORT: 'CANCEL_ABORT',

  DESTROY_SUCCESS: 'DESTROY_SUCCESS',
  RESET: 'RESET'
};

export default MigrateLSReducer;
