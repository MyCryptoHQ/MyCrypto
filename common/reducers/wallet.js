// @flow
import type { WalletAction, SaveWalletAction } from 'actions/wallet';
import BaseWallet from 'libs/wallet/base';

export type State = ?BaseWallet;

const initialState: State = null;

function saveWallet(state: State, action: SaveWalletAction): State {
    return action.payload;
}

export function wallet(state: State = initialState, action: WalletAction): State {
    switch (action.type) {
        case 'WALLET_SAVE':
            return saveWallet(state, action);
        default:
            return state;
    }
}
