import { getDerivationPath } from '@mycrypto/wallets';
import { Reducer } from '@reduxjs/toolkit';
import {
  createMigrate,
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  PersistConfig,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  StateReconciler,
  Transform,
  TransformInbound,
  TransformOutbound
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { OmitByValue, ValuesType } from 'utility-types';

import { defaultContacts } from '@database';
import { DataStore, LocalStorage, LSKeys, NetworkId, TUuid } from '@types';
import { arrayToObj, IS_DEV } from '@utils';
import { dissoc, flatten, pipe, propEq, reject, values } from '@vendor';

import { generateCustomDPath, mergeAssets, mergeNetworks } from './helpers';

export const REDUX_PERSIST_ACTION_TYPES = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

/**
 * Called right before state is persisted.
 * inbound: transform state coming from redux on its way to being serialized and stored
 * @param slice
 * @param key
 */
const fromReduxStore: TransformInbound<
  ValuesType<DataStore>,
  ValuesType<LocalStorage>,
  LocalStorage
> = (slice, key) => {
  switch (key) {
    case LSKeys.ACCOUNTS:
    case LSKeys.ADDRESS_BOOK:
    case LSKeys.CONTRACTS:
    case LSKeys.ASSETS:
    case LSKeys.NOTIFICATIONS:
    case LSKeys.USER_ACTIONS: {
      //@ts-expect-error: TS doesnt' respect switch type-guard
      return arrayToObj<TUuid>('uuid')(slice);
    }
    case LSKeys.NETWORKS: {
      //@ts-expect-error: TS doesnt' respect switch type-guard
      return arrayToObj<NetworkId>('id')(slice);
    }
    case LSKeys.SETTINGS:
    default:
      return slice;
  }
};
/**
 * Called right before state is rehydrated.
 * outbound: transform state coming from storage, on its way to be rehydrated into redux
 * @param slice
 * @param key
 */
const fromPersistenceLayer: TransformOutbound<
  ValuesType<DataStore>,
  ValuesType<DataStore>,
  LocalStorage
> = (slice, key) => {
  switch (key) {
    case LSKeys.ACCOUNTS:
    case LSKeys.ADDRESS_BOOK:
    case LSKeys.CONTRACTS:
    case LSKeys.ASSETS:
    case LSKeys.NOTIFICATIONS:
    case LSKeys.USER_ACTIONS:
    case LSKeys.NETWORKS:
      return Object.values(slice);
    case LSKeys.SETTINGS:
    default:
      return slice;
  }
};

// @ts-expect-error:  Type 'string' is not assignable to type 'Pick<LocalStorage, LSKeys | "version"> !??
const transform: Transform<
  OmitByValue<LocalStorage, number>,
  ValuesType<DataStore>,
  DataStore,
  LocalStorage
> = createTransform(fromReduxStore, fromPersistenceLayer);

/**
 * Custom State Reconciler.
 * inboundState is already passed through beforeRehydrate so it is a valid
 * DataStore
 * @param inboundState
 * @param originalState
 * @param reducedState
 * @param config
 */
const customReconciler: StateReconciler<DataStore> = (inboundState, originalState, ...rest) => {
  // Merge 2 arrays by creating an object and converting back to array.
  const mergeByUuid = pipe(arrayToObj<TUuid>('uuid'), values, flatten);

  const mergedInboundState = {
    ...inboundState,
    [LSKeys.ASSETS]: mergeAssets(inboundState.assets, originalState.assets),
    [LSKeys.CONTRACTS]: mergeByUuid([...inboundState.contracts, ...originalState.contracts]),
    [LSKeys.NETWORKS]: mergeNetworks(inboundState.networks, originalState.networks)
  };

  return autoMergeLevel2(mergedInboundState, originalState, ...rest);
};

/**
 * Called when retrieving data from persisted state and before `beforeRehydrate`
 * Allows migration between legacy state objects and redux-persist schema which
 * stringifies the persisted layer.
 * @param slice
 */
const customDeserializer = (slice: ValuesType<LocalStorage>) => {
  if (typeof slice === 'string') {
    if (slice === 'v2.0.0' || slice === 'v1.0.0' || slice === 'v1.1.0' || slice === '')
      return slice;
    return JSON.parse(slice);
  } else {
    return slice;
  }
};

export const migrations = {
  2: (state: DataStore) => {
    return {
      ...state,
      // @ts-expect-error Autonode is present on data to be migrated, want to remove it
      networks: state.networks.map(({ autoNode, ...n }) => ({
        ...n,
        selectedNode: n.selectedNode === autoNode ? undefined : n.selectedNode
      }))
    };
  },
  3: (state: DataStore) => {
    const MYC_DONATE_CONTACT = values(defaultContacts)[0];
    return {
      ...state,
      // Update the label and description of the MYC donate address which exists in
      // a users local storage.
      [LSKeys.ADDRESS_BOOK]: [
        ...reject(propEq('uuid', MYC_DONATE_CONTACT.uuid), state[LSKeys.ADDRESS_BOOK]),
        MYC_DONATE_CONTACT
      ]
    };
  },
  4: (state: DataStore) => {
    return {
      ...state,
      // @ts-expect-error rates are present in settings on data to be migrated, want to move it at root of persistence layer
      rates: state.rates ? state.rates : state.settings.rates ? state.settings.rates : [],
      trackedAssets: state.trackedAssets ? state.trackedAssets : [],
      settings: dissoc('rates', state.settings)
    };
  },
  5: (state: DataStore) => {
    return {
      ...state,
      settings: dissoc('inactivityTimer', state.settings)
    };
  },
  6: (state: DataStore) => {
    return {
      ...state,
      // @ts-expect-error dPath is present on data to be migrated, want to remove it
      accounts: state.accounts.map(({ dPath, ...account }) => {
        if (!dPath) {
          return account;
        }
        const result = getDerivationPath(dPath);
        const [path, index] = result ?? generateCustomDPath(dPath);
        return {
          ...account,
          path,
          index
        };
      })
    };
  }
};

// @ts-expect-error: bad type for migrations
export const migrate = createMigrate(migrations, { debug: IS_DEV });

export const APP_PERSIST_CONFIG: PersistConfig<DataStore> = {
  version: 6,
  key: 'Storage',
  keyPrefix: 'MYC_',
  storage,
  blacklist: [],
  stateReconciler: customReconciler,
  transforms: [transform],
  // @ts-expect-error: deserialize is redux-persist internal
  deserialize: customDeserializer,
  debug: IS_DEV,
  migrate
};

export const createPersistReducer = (reducer: Reducer<DataStore>) =>
  persistReducer(APP_PERSIST_CONFIG, reducer);
