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

import { DataStore, EncryptedDataStore, LocalStorage, LSKeys, NetworkId, TUuid } from '@types';
import { arrayToObj, IS_DEV } from '@utils';
import { flatten, pipe, values } from '@vendor';

import { mergeAssets, mergeNetworks } from './helpers';

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
      //@ts-expect-error: TS doesnt' respect swtich type-guard
      return arrayToObj<TUuid>('uuid')(slice);
    }
    case LSKeys.NETWORKS: {
      //@ts-expect-error: TS doesnt' respect swtich type-guard
      return arrayToObj<NetworkId>('id')(slice);
    }
    case LSKeys.SETTINGS:
    case LSKeys.PASSWORD:
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
    case LSKeys.PASSWORD:
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
    if (slice === 'v1.0.0' || slice === 'v1.1.0' || slice === '') return slice;
    return JSON.parse(slice);
  } else {
    return slice;
  }
};

const migrations = {
  2: (state: DataStore) => {
    return {
      ...state,
      networks: state.networks.map((n) => ({
        ...n,
        autoNode: undefined,
        // @ts-expect-error Autonode is present on data to be migrated
        selectedNode: n.selectedNode === n.autoNode ? undefined : n.selectedNode
      }))
    };
  }
};

const APP_PERSIST_CONFIG: PersistConfig<DataStore> = {
  version: 2,
  key: 'Storage',
  keyPrefix: 'MYC_',
  storage,
  blacklist: [],
  stateReconciler: customReconciler,
  transforms: [transform],
  // @ts-expect-error: deserialize is redux-persist internal
  deserialize: customDeserializer,
  debug: IS_DEV,
  // @ts-expect-error: bad type for migrations
  migrate: createMigrate(migrations, { debug: IS_DEV })
};

export const createPersistReducer = (reducer: Reducer<DataStore>) =>
  persistReducer(APP_PERSIST_CONFIG, reducer);

const VAULT_PERSIST_CONFIG: PersistConfig<EncryptedDataStore> = {
  key: 'Vault',
  keyPrefix: 'MYC_',
  blacklist: ['error'],
  storage,
  // @ts-expect-error: deserialize is redux-persist internal
  deserialize: customDeserializer,
  debug: IS_DEV
};

export const createVaultReducer = (reducer: Reducer) =>
  persistReducer(VAULT_PERSIST_CONFIG, reducer);
