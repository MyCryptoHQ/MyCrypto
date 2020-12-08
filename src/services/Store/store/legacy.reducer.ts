import { Reducer } from '@reduxjs/toolkit';

import { DataStore, DataStoreEntry, DataStoreItem, DSKeys, LSKeys, TUuid } from '@types';
import { eqBy, prop, symmetricDifferenceWith, unionWith } from '@vendor';

import accountSlice, {
  createAccount,
  createAccounts,
  destroyAccount,
  updateAccount,
  updateAccounts
} from './account.slice';
import assetSlice, {
  addAssetsFromAPI,
  createAsset,
  createAssets,
  destroyAsset,
  fetchAssets,
  updateAsset,
  updateAssets
} from './asset.slice';
import contactSlice, { createContact, destroyContact, updateContact } from './contact.slice';
import contractSlice, { createContract, destroyContract } from './contract.slice';
import { initialLegacyState } from './legacy.initialState';
import networkSlice, {
  createNetwork,
  createNetworks,
  deleteNode,
  destroyNetwork,
  updateNetwork,
  updateNetworks
} from './network.slice';
import notificationSlice, { createNotification, updateNotification } from './notification.slice';
import passwordSlice, { setPassword } from './password.slice';
import settingsSlice, {
  addExcludedAsset,
  addFavorite,
  addFavorites,
  removeExcludedAsset,
  resetFavoritesTo,
  setFiat,
  setInactivityTimer,
  setLanguage,
  setRates
} from './settings.slice';
import userActionSlice, {
  createUserAction,
  destroyUserAction,
  updateUserAction
} from './userAction.slice';

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
      if (model === LSKeys.SETTINGS) {
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
    case addFavorite.type:
    case addFavorites.type:
    case resetFavoritesTo.type:
    case setLanguage.type:
    case setFiat.type:
    case addExcludedAsset.type:
    case removeExcludedAsset.type:
    case setRates.type:
    case setInactivityTimer.type: {
      return {
        ...state,
        [LSKeys.SETTINGS]: settingsSlice.reducer(state.settings, action)
      };
    }
    case createNetwork.type:
    case createNetworks.type:
    case updateNetwork.type:
    case updateNetworks.type:
    case destroyNetwork.type:
    case deleteNode.type: {
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
    case createAsset.type:
    case createAssets.type:
    case updateAsset.type:
    case updateAssets.type:
    case destroyAsset.type:
    case addAssetsFromAPI.type:
    case fetchAssets.type: {
      return {
        ...state,
        [LSKeys.ASSETS]: assetSlice.reducer(state.assets, action)
      };
    }

    case createContact.type:
    case updateContact.type:
    case destroyContact.type: {
      return {
        ...state,
        [LSKeys.ADDRESS_BOOK]: contactSlice.reducer(state.addressBook, action)
      };
    }

    case createUserAction.type:
    case updateUserAction.type:
    case destroyUserAction.type: {
      return {
        ...state,
        [LSKeys.USER_ACTIONS]: userActionSlice.reducer(state.userActions, action)
      };
    }

    case createContract.type:
    case destroyContract.type: {
      return {
        ...state,
        [LSKeys.CONTRACTS]: contractSlice.reducer(state.contracts, action)
      };
    }

    case createNotification.type:
    case updateNotification.type: {
      return {
        ...state,
        [LSKeys.NOTIFICATIONS]: notificationSlice.reducer(state.notifications, action)
      };
    }
    case setPassword.type: {
      return {
        ...state,
        [LSKeys.PASSWORD]: passwordSlice.reducer(state.password, action)
      };
    }
    default: {
      return state;
    }
  }
};
export default legacyReducer;
