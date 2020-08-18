import { TAction } from '@types';

export type UIStates =
  | 'default'
  | 'migrate-prompt'
  | 'migrate-success'
  | 'migrate-error'
  | 'load-error'
  | 'confirm-cancel'
  | 'confirm-success';

interface State {
  readonly iframeRef?: HTMLIFrameElement;
  readonly storage?: string;
  readonly error?: Error;
  readonly isLoading: boolean;
  readonly canDestroy: boolean;
  readonly canDownload: boolean;
  readonly uiState: UIStates;
}

export const defaultState: State = {
  storage: undefined,
  iframeRef: undefined,
  error: undefined,
  uiState: 'default',
  isLoading: false,
  canDestroy: false,
  canDownload: false
};

export type MigrateLSAction = TAction<string, any>;

const MigrateLSReducer = (state: State, action?: MigrateLSAction): State => {
  const { type, payload } = action || {};
  switch (type) {
    case MigrateLSReducer.actionTypes.IFRAME_LOAD_FAILURE:
      return {
        ...state,
        uiState: 'load-error'
      };
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
        isLoading: false,
        error: payload.error
      };
    }
    case MigrateLSReducer.actionTypes.CANCEL_REQUEST: {
      return {
        ...state,
        uiState: 'confirm-cancel',
        isLoading: true
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
        isLoading: false,
        canDownload: true,
        canDestroy: true
      };
    }

    case MigrateLSReducer.actionTypes.RESET:
    default:
      return defaultState;
  }
};

MigrateLSReducer.actionTypes = {
  IFRAME_LOAD_SUCCESS: 'IFRAME_LOAD_SUCCESS',
  IFRAME_LOAD_FAILURE: 'IFRAME_LOAD_FAILURE',

  MIGRATE_REQUEST: 'MIGRATE_REQUEST',
  MIGRATE_SUCCESS: 'MIGRATE_SUCCESS',
  MIGRATE_FAILURE: 'MIGRATE_FAILURE',

  CANCEL_REQUEST: 'CANCEL_REQUEST',
  CANCEL_CONFIRM: 'CANCEL_CONFIRM',
  CANCEL_ABORT: 'CANCEL_ABORT',
  RESET: 'RESET'
};

export default MigrateLSReducer;
