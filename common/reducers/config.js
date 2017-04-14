import {
    CONFIG_LANGUAGE_CHANGE,
    CONFIG_LANGUAGE_DROPDOWN_TOGGLE,
    CONFIG_NODE_CHANGE,
    CONFIG_NODE_DROPDOWN_TOGGLE
} from 'actions/config'


const initialState = {
    languageSelection: 0,
    languageToggle: false,
    nodeSelection: 0,
    nodeToggle: false
}

export function config(state = initialState, action) {
    switch (action.type) {
        case CONFIG_LANGUAGE_CHANGE: {
            return {
                ...state,
                languageSelection: action.index,
                languageToggle: false
            }
        }
        case CONFIG_LANGUAGE_DROPDOWN_TOGGLE: {
            return {
                ...state,
                languageToggle: !state.languageToggle
            }
        }
        case CONFIG_NODE_CHANGE: {
            return {
                ...state,
                nodeSelection: action.index,
                nodeToggle: false
            }
        }
        case CONFIG_NODE_DROPDOWN_TOGGLE: {
            return {
                ...state,
                nodeToggle: !state.languageToggle
            }
        }
        default:
            return state
    }
}

export const languages = [
    {
        'sign': 'en',
        'name': 'English'
    },
    {
        'sign': 'de',
        'name': 'Deutsch'
    },
    {
        'sign': 'el',
        'name': 'Ελληνικά'
    },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },
    // {
    //     "sign": 'el',
    //     "name": 'Ελληνικά'
    // },

];


export const nodeList = [
    {
        'name': 'ETH',
        'blockExplorerTX': 'https://etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://etherscan.io/address/[[address]]',
        // 'type': nodes.nodeTypes.ETH,
        'eip155': true,
        'chainId': 1,
        // 'tokenList': require('./tokens/ethTokens.json'),
        // 'abiList': require('./abiDefinitions/ethAbi.json'),
        'estimateGas': true,
        'service': 'MyEtherWallet',
        // 'lib': new nodes.customNode('https://api.myetherapi.com/eth', '')
    },
    {
        'name': 'ETH',
        'blockExplorerTX': 'https://etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://etherscan.io/address/[[address]]',
        // 'type': nodes.nodeTypes.ETH,
        'eip155': true,
        'chainId': 1,
        // 'tokenList': require('./tokens/ethTokens.json'),
        // 'abiList': require('./abiDefinitions/ethAbi.json'),
        'estimateGas': false,
        'service': 'Etherscan.io',
        // 'lib': require('./nodeHelpers/etherscan')
    },
    {
        'name': 'Ropsten',
        // 'type': nodes.nodeTypes.Ropsten,
        'blockExplorerTX': 'https://ropsten.etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://ropsten.etherscan.io/address/[[address]]',
        'eip155': true,
        'chainId': 3,
        // 'tokenList': require('./tokens/ropstenTokens.json'),
        // 'abiList': require('./abiDefinitions/ropstenAbi.json'),
        'estimateGas': false,
        'service': 'MyEtherWallet',
        // 'lib': new nodes.customNode('https://api.myetherapi.com/rop', '')
    },
    {
        'name': 'Kovan',
        // 'type': nodes.nodeTypes.Kovan,
        'blockExplorerTX': 'https://kovan.etherscan.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://kovan.etherscan.io/address/[[address]]',
        'eip155': true,
        'chainId': 42,
        // 'tokenList': require('./tokens/kovanTokens.json'),
        // 'abiList': require('./abiDefinitions/kovanAbi.json'),
        'estimateGas': false,
        'service': 'Etherscan.io',
        // 'lib': require('./nodeHelpers/etherscanKov')
    },
    {
        'name': 'ETC',
        'blockExplorerTX': 'https://gastracker.io/tx/[[txHash]]',
        'blockExplorerAddr': 'https://gastracker.io/addr/[[address]]',
        // 'type': nodes.nodeTypes.ETC,
        'eip155': true,
        'chainId': 61,
        // 'tokenList': require('./tokens/etcTokens.json'),
        // 'abiList': require('./abiDefinitions/etcAbi.json'),
        'estimateGas': false,
        'service': 'Epool.io',
        // 'lib': new nodes.customNode('https://mewapi.epool.io', '')
    }
]
