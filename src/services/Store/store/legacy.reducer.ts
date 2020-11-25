import { Reducer } from '@reduxjs/toolkit';

import { DataStore, DataStoreEntry, DataStoreItem, DSKeys, LSKeys, Network, TUuid } from '@types';
import { eqBy, prop, symmetricDifferenceWith, unionWith } from '@vendor';

import accountSlice, {
  createAccount,
  createAccounts,
  destroyAccount,
  updateAccount,
  updateAccounts
} from './account.slice';
import { initialLegacyState } from './legacy.initialState';
import networkSlice, {
  createNetwork,
  createNetworks,
  destroyNetwork,
  updateNetwork,
  updateNetworks
} from './network.slice';
import notificationSlice, { createNotification, updateNotification } from './notification.slice';

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
// Handler to facilitate initial store state and reset.
export function init(initialState: DataStore) {
  return initialState;
}

const legacyReducer: Reducer<DataStore, ActionV> = (state = initialLegacyState, action) => {
  const { type, payload } = action;
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

    /**
     * Delegate notification handling to appropriate slice.
     * We place it in legacy reducer instead of combine reducer to respect
     * legacy state shape.
     * @todo: Redux. Place in individual slice once reducer migration begins.
     */
    case createNetwork.type:
    case createNetworks.type:
    case updateNetwork.type:
    case updateNetworks.type:
    case destroyNetwork.type: {
      return {
        ...state,
        [LSKeys.NETWORKS]: networkSlice.reducer(state.networks, action)
      };
    }
    case createAccount.type:
    case createAccounts.type:
    case updateAccount.type:
    case updateAccounts.type:
    case destroyAccount.type: {
      return {
        ...state,
        [LSKeys.ACCOUNTS]: accountSlice.reducer(state.accounts, action)
      };
    }

    // case createNotification.type:
    // case updateNotification.type: {
    //   return {
    //     ...state,
    //     [LSKeys.NOTIFICATIONS]: notificationSlice.reducer(state.notifications, action)
    //   };
    // }
    default: {
      return state;
    }
  }
};
export default legacyReducer;
