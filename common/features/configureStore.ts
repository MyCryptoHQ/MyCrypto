import { applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import throttle from 'lodash/throttle';

import { loadStatePropertyOrEmptyObject, saveState } from 'utils/localStorage';
import { gasPriceToBase } from 'libs/units';
import RootReducer, { AppState } from './reducers';
import sagas from './sagas';
import { TransactionState } from './transaction/types';
import { INITIAL_STATE as transactionInitialState } from './transaction/reducer';
import { SwapState } from './swap/types';
import { INITIAL_STATE as initialSwapState } from './swap/reducer';
import { AddressBookState } from './addressBook/types';
import { TransactionsState } from './transactions/types';
import { INITIAL_STATE as initialTransactionsState } from './transactions/reducer';
import { WalletState } from './wallet/types';
import { INITIAL_STATE as initialWalletState } from './wallet/reducer';
import { OnboardingState } from './onboarding/types';
import { INITIAL_STATE as initialOnboardingState } from './onboarding/reducer';
import {
  rehydrateConfigAndCustomTokenState,
  getConfigAndCustomTokensStateToSubscribe
} from './configAndTokens';
import rehydrateAddressBook from './rehydrateAddressBook';

export default function configureStore() {
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
  const savedOnboardingState = loadStatePropertyOrEmptyObject<OnboardingState>('onboarding');

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
    addressBook: rehydrateAddressBook(savedAddressBook),
    wallet: {
      ...initialWalletState,
      ...savedWalletState
    },
    onboarding: {
      ...initialOnboardingState,
      ...savedOnboardingState
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
        onboarding: state.onboarding,
        ...getConfigAndCustomTokensStateToSubscribe(state)
      });
    }, 50)
  );

  return store;
}
