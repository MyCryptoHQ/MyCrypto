import {
    GENERATE_WALLET_SHOW_PASSWORD,
    GENERATE_WALLET_FILE,
    GENERATE_WALLET_HAS_DOWNLOADED_FILE,
    GENERATE_WALLET_CONTINUE_TO_PAPER

} from 'actions/generateWallet';


const initialState = {
    showPassword: false,
    generateWalletFile: false,
    hasDownloadedWalletFile: false,
    canProceedToPaper: false
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

        case GENERATE_WALLET_HAS_DOWNLOADED_FILE: {
            return {
                ...state,
                hasDownloadedWalletFile: true
            }
        }

        case GENERATE_WALLET_CONTINUE_TO_PAPER: {
            return {
                ...state,
                canProceedToPaper: true
            }
        }

        default:
            return state
    }
}
