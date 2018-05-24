import throttle from 'lodash/throttle';
import { routerMiddleware } from 'react-router-redux';
import {
  INITIAL_STATE as transactionInitialState,
  State as TransactionState
} from 'reducers/transaction';
import {
  INITIAL_STATE as initialTransactionsState,
  State as TransactionsState
} from 'reducers/transactions';
import { State as SwapState, INITIAL_STATE as initialSwapState } from 'reducers/swap';
import { State as WalletState, INITIAL_STATE as initialWalletState } from 'reducers/wallet';
import {
  State as AddressBookState,
  INITIAL_STATE as initialAddressBookState
} from 'reducers/addressBook';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { loadStatePropertyOrEmptyObject, saveState } from 'utils/localStorage';
import RootReducer, { AppState } from 'reducers';
import sagas from 'sagas';
import { gasPriceToBase } from 'libs/units';
import {
  rehydrateConfigAndCustomTokenState,
  getConfigAndCustomTokensStateToSubscribe
} from './configAndTokens';
import fixAddressBookErrors from 'utils/fixAddressBookErrors';

const configureStore = () => {
  const logger = createLogger({
    collapsed: true
  });
  const sagaMiddleware = createSagaMiddleware();
  let middleware;
  let store: Store<AppState>;

  if (process.env.NODE_ENV !== 'production') {
    middleware = composeWithDevTools(
      applyMiddleware(sagaMiddleware, logger, routerMiddleware(history as any))
    );
  } else {
    middleware = applyMiddleware(sagaMiddleware, routerMiddleware(history as any));
  }

  // ONLY LOAD SWAP STATE FROM LOCAL STORAGE IF STEP WAS 3
  const localSwapState = loadStatePropertyOrEmptyObject<SwapState>('swap');
  const swapState =
    localSwapState && localSwapState.step === 3
      ? {
          ...initialSwapState,
          ...localSwapState
        }
      : { ...initialSwapState };

  const savedTransactionState = loadStatePropertyOrEmptyObject<TransactionState>('transaction');
  const savedTransactionsState = loadStatePropertyOrEmptyObject<TransactionsState>('transactions');
  const savedAddressBook = loadStatePropertyOrEmptyObject<AddressBookState>('addressBook');
  const savedWalletState = loadStatePropertyOrEmptyObject<WalletState>('wallet');

  const persistedInitialState: Partial<AppState> = {
    transaction: {
      ...transactionInitialState,
      fields: {
        ...transactionInitialState.fields,
        gasPrice:
          savedTransactionState && savedTransactionState.fields.gasPrice
            ? {
                raw: savedTransactionState.fields.gasPrice.raw,
                value: gasPriceToBase(+savedTransactionState.fields.gasPrice.raw)
              }
            : transactionInitialState.fields.gasPrice
      }
    },
    swap: swapState,
    transactions: {
      ...initialTransactionsState,
      ...savedTransactionsState
    },
    addressBook: {
      ...initialAddressBookState,
      ...fixAddressBookErrors(savedAddressBook)
    },
    wallet: {
      ...initialWalletState,
      ...savedWalletState
    },
    ...rehydrateConfigAndCustomTokenState()
  };

  store = createStore<AppState>(RootReducer, persistedInitialState as any, middleware);

  // Add all of the sagas to the middleware
  Object.keys(sagas).forEach((saga: keyof typeof sagas) => {
    sagaMiddleware.run(sagas[saga]);
  });

  store.subscribe(
    throttle(() => {
      const state: AppState = store.getState();

      saveState({
        transaction: {
          fields: {
            gasPrice: state.transaction.fields.gasPrice
          }
        },
        swap: {
          ...state.swap,
          options: {
            byId: {},
            allIds: []
          },
          bityRates: {
            byId: {},
            allIds: []
          },
          shapeshiftRates: {
            byId: {},
            allIds: []
          }
        },
        transactions: {
          recent: state.transactions.recent
        },
        addressBook: state.addressBook,
        wallet: {
          recentAddresses: state.wallet.recentAddresses
        },
        ...getConfigAndCustomTokensStateToSubscribe(state)
      });
    }, 50)
  );

  return store;
};

export const configuredStore = configureStore();
