import {GENERATE_WALLET_SHOW_PASSWORD, GENERATE_WALLET_FILE} from "actions/generateWallet";


const initialState = {
    showPassword: false,
    generateWalletFile: false,
    generateWalletFileConfirm: false
}

export function generateWallet(state = initialState, action) {
    switch (action.type) {
        case GENERATE_WALLET_SHOW_PASSWORD: {
            return {
                ...state,
                showPassword: !state.showPassword
            }
        }

        case GENERATE_WALLET_FILE: {
            return {
                ...state,
                generateWalletFile: true
            }
        }

        default:
            return state
    }
}
