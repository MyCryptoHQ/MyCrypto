import { Reducer } from '@reduxjs/toolkit';
import {
  createTransform,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
  StateReconciler,
  TransformInbound,
  TransformOutbound
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { ValuesType } from 'utility-types';

import { DataStore, LocalStorage, LSKeys, NetworkId, TUuid } from '@types';
import { flatten, indexBy, pipe, prop, values } from '@vendor';

export const REDUX_PERSIST_ACTION_TYPES = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

const arrayToObj = (key: string | TUuid | NetworkId) => (arr: any[]) => indexBy(prop(key), arr);

/**
 * Called right before state is persisted.
 * @param slice
 * @param key
 */
const beforePersist: TransformInbound<
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
    case LSKeys.USER_ACTIONS:
      return arrayToObj('uuid')(slice);
    case LSKeys.NETWORKS: {
      return arrayToObj('id')(slice);
    }
    case LSKeys.SETTINGS:
    case LSKeys.PASSWORD:
    default:
      return slice;
  }
};
/**
 * Called right before state is rehydrated
 * @param slice
 * @param key
 */
const beforeRehydrate: TransformOutbound<
  ValuesType<LocalStorage>,
  ValuesType<DataStore>,
  DataStore
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

const transform = createTransform(beforePersist, beforeRehydrate);

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
  const mergeNetworks = pipe(arrayToObj('id'), values, flatten);
  const mergeContracts = pipe(arrayToObj('uuid'), values, flatten);

  const mergedInboundState = {
    ...inboundState,
    [LSKeys.CONTRACTS]: mergeContracts([...inboundState.contracts, ...originalState.contracts]),
    [LSKeys.NETWORKS]: mergeNetworks([...inboundState.networks, ...originalState.networks])
  };

  return autoMergeLevel2(mergedInboundState, originalState, ...rest);
};

/**
 * Called when retrieving data from persisted state and before `beforeRehydrate`
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

const APP_PERSIST_CONFIG = {
  key: 'Storage',
  keyPrefix: 'MYC_',
  storage,
  blacklist: [],
  stateReconciler: customReconciler,
  transforms: [transform],
  deserialize: customDeserializer,
  debug: true
};

export const createPersistReducer = (reducer: Reducer<DataStore>) =>
  persistReducer(APP_PERSIST_CONFIG, reducer);
