// @flow
import type { WalletAction, SaveWalletAction, InitWalletAction } from 'actions/wallet';
import BaseWallet from 'libs/wallet/base';

export type State = {
    inst: ?BaseWallet,
    balance: number,
    tokens: {
        [string]: number
    }
};

const initialState: State = {
    inst: null,
    balance: 0,
    tokens: {}
};

function saveWallet(state: State, action: SaveWalletAction): State {
    return { ...state, inst: action.payload };
}

function initWallet(state: State): State {
    return { ...state, balance: 0, tokens: {} };
}

export function wallet(state: State = initialState, action: WalletAction): State {
    switch (action.type) {
        case 'WALLET_SAVE':
            return saveWallet(state, action);
        case 'WALLET_INIT':
            return initWallet(state);
        default:
            return state;
    }
}
