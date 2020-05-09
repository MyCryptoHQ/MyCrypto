import eqBy from 'ramda/src/eqBy';
import prop from 'ramda/src/prop';
import unionWith from 'ramda/src/unionWith';
import symmetricDifferenceWith from 'ramda/src/symmetricDifferenceWith';

import {
  LSKeys,
  DataStoreEntry,
  DataStoreItem,
  TUuid,
  Network,
  EncryptedDataStore,
  DataStore,
  DSKeys
} from '@types';

export enum ActionT {
  ADD_ITEM = 'ADD_ITEM',
  DELETE_ITEM = 'DELETE_ITEM',
  UPDATE_ITEM = 'UPDATE_ITEM',
  UPDATE_NETWORK = 'UPDATE_NETWORK',
  ADD_ENTRY = 'ADD_ENTRY',
  RESET = 'RESET'
}

export interface ActionPayload<T> {
  model: DSKeys;
  data: T;
}

export interface ActionV {
  type: keyof typeof ActionT;
  payload:
    | ActionPayload<DataStoreItem | DataStoreEntry | DataStore | string>
    | ActionPayload<TUuid>;
}

export enum ActionY {
  CLEAR_DATA = 'CLEAR_DATA',
  SET_DATA = 'SET_DATA'
}

export interface EncryptedDbActionPayload<T> {
  data?: T;
}

export interface ActionZ {
  type: keyof typeof ActionY;
  payload: EncryptedDbActionPayload<string>;
}

// Handler to facilitate initial store state and reset.
export function init(initialState: DataStore) {
  return initialState;
}

export function appDataReducer(state: DataStore, { type, payload }: ActionV) {
  switch (type) {
    case ActionT.ADD_ITEM: {
      const { model, data } = payload;
      if (model === LSKeys.SETTINGS) {
        throw new Error('[AppReducer: use ADD_ENTRY to change SETTINGS');
      } else {
        return {
          ...state,
          [model]: [...new Set([...state[model], data])]
        };
      }
    }
    case ActionT.DELETE_ITEM: {
      const { model, data } = payload;
      if (model === LSKeys.SETTINGS || model === LSKeys.NETWORKS) {
        throw new Error(`[AppReducer: cannot call DELETE_ITEM for ${model}`);
      }

      const predicate = eqBy(prop('uuid'));

      return {
        ...state,
        [model]: symmetricDifferenceWith(predicate, [data], state[model] as any)
      };
    }
    case ActionT.UPDATE_ITEM: {
      const { model, data } = payload;
      if (model === LSKeys.SETTINGS) {
        throw new Error('[AppReducer: use ADD_ENTRY to update SETTINGS');
      }
      const predicate = eqBy(prop('uuid'));
      return {
        ...state,
        // Find item in array by uuid and replace.
        [model]: unionWith(predicate, [data], state[model] as any)
      };
    }
    case ActionT.UPDATE_NETWORK: {
      const { data } = payload;
      const predicate = eqBy(prop('id'));
      const networks = state.networks;
      return {
        ...state,
        // Find network in array by id and replace.
        [LSKeys.NETWORKS]: unionWith(predicate, [data as Network], networks)
      };
    }

    case ActionT.ADD_ENTRY: {
      const { model, data } = payload;
      return {
        ...state,
        [model]: data
      };
    }
    case ActionT.RESET: {
      const { data } = payload;
      return init(data as DataStore);
    }
    default: {
      throw new Error('[AppReducer]: missing action type');
    }
  }
}

export function encryptedDbReducer(
  state: EncryptedDataStore,
  { type, payload }: ActionZ
): EncryptedDataStore {
  switch (type) {
    case ActionY.SET_DATA: {
      return {
        ...state,
        ...payload
      };
    }
    case ActionY.CLEAR_DATA: {
      return {};
    }

    default: {
      throw new Error('[EncryptedDbReducer]: missing action type');
    }
  }
}
