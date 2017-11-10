import {
  SetBalanceAction,
  SetTokenBalancesAction,
  SetWalletAction,
  WalletAction,
  TypeKeys
} from 'actions/wallet';
import { Wei, TokenValue } from 'libs/units';
import { BroadcastTransactionStatus } from 'libs/transaction';
import { IWallet } from 'libs/wallet';
import { getTxFromBroadcastTransactionStatus } from 'selectors/wallet';

export interface State {
  inst?: IWallet | null;
  // in ETH
  balance?: Wei | null;
  tokens: {
    [key: string]: TokenValue;
  };
  transactions: BroadcastTransactionStatus[];
}

export const INITIAL_STATE: State = {
  inst: null,
  balance: null,
  tokens: {},
  transactions: []
};

function setWallet(state: State, action: SetWalletAction): State {
  return { ...state, inst: action.payload, balance: null, tokens: {} };
}

function setBalance(state: State, action: SetBalanceAction): State {
  const weiBalance = action.payload;
  return { ...state, balance: weiBalance };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

function handleUpdateTxArray(
  transactions: BroadcastTransactionStatus[],
  broadcastStatusTx: BroadcastTransactionStatus,
  isBroadcasting: boolean,
  successfullyBroadcast: boolean
): BroadcastTransactionStatus[] {
  return transactions.map(item => {
    if (item === broadcastStatusTx) {
      return { ...item, isBroadcasting, successfullyBroadcast };
    } else {
      return { ...item };
    }
  });
}

function handleTxBroadcastCompleted(
  state: State,
  signedTx: string,
  successfullyBroadcast: boolean
): BroadcastTransactionStatus[] {
  const existingTx = getTxFromBroadcastTransactionStatus(
    state.transactions,
    signedTx
  );
  if (existingTx) {
    const isBroadcasting = false;
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  } else {
    return state.transactions;
  }
}

function handleBroadcastTxRequested(state: State, signedTx: string) {
  const existingTx = getTxFromBroadcastTransactionStatus(
    state.transactions,
    signedTx
  );
  const isBroadcasting = true;
  const successfullyBroadcast = false;
  if (!existingTx) {
    return state.transactions.concat([
      {
        signedTx,
        isBroadcasting,
        successfullyBroadcast
      }
    ]);
  } else {
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  }
}

export function wallet(
  state: State = INITIAL_STATE,
  action: WalletAction
): State {
  switch (action.type) {
    case TypeKeys.WALLET_SET:
      return setWallet(state, action);
    case TypeKeys.WALLET_RESET:
      return INITIAL_STATE;
    case TypeKeys.WALLET_SET_BALANCE:
      return setBalance(state, action);
    case TypeKeys.WALLET_SET_TOKEN_BALANCES:
      return setTokenBalances(state, action);
    case TypeKeys.WALLET_BROADCAST_TX_REQUESTED:
      return {
        ...state,
        transactions: handleBroadcastTxRequested(state, action.payload.signedTx)
      };
    case TypeKeys.WALLET_BROADCAST_TX_SUCCEEDED:
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          true
        )
      };
    case TypeKeys.WALLET_BROADCAST_TX_FAILED:
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          false
        )
      };
    default:
      return state;
  }
}
