import { TURL } from '@types';

const KB_URL = 'https://support.mycrypto.com';

export enum KB_HELP_ARTICLE {
  HOME = '',
  ENS = 'how-to/ens',
  ENS_BAD_REVEAL = 'troubleshooting/ens/ens-debugging-a-bad-instruction-reveal',
  DIFFERENCE_BETWEEN_PKEY_AND_KEYSTORE = 'general-knowledge/ethereum-blockchain/difference-between-wallet-types',
  RUNNING_LOCALLY = 'how-to/offline/how-to-run-mycrypto-offline-and-locally',
  MIGRATE_TO_METAMASK = 'how-to/migrating/moving-from-mycrypto-to-metamask',
  MIGRATE_TO_LEDGER = 'how-to/migrating/moving-from-mycrypto-to-ledger',
  MIGRATE_TO_TREZOR = 'how-to/migrating/moving-from-mycrypto-to-trezor',
  ADDING_NEW_TOKENS = 'troubleshooting/tokens/adding-new-token-and-sending-custom-tokens',
  HARDWARE_WALLET_RECOMMENDATIONS = 'staying-safe/hardware-wallet-recommendations',
  SENDING_TO_TREZOR = 'how-to/sending/trezor-sending-to',
  HOW_TO_USE_LEDGER = 'how-to/migrating/moving-from-mycrypto-to-ledger',
  SECURING_YOUR_ETH = 'staying-safe/protecting-yourself-and-your-funds',
  WHAT_IS_NONCE = 'general-knowledge/ethereum-blockchain/what-is-nonce',
  WHAT_IS_GAS = 'general-knowledge/ethereum-blockchain/what-is-gas',
  WALLETCONNECT = 'how-to/accessing-wallet/how-to-use-walletconnect-with-mycrypto',
  STAYING_SAFE = 'staying-safe',
  BUY_CRYPTO = 'how-to/getting-started/how-to-buy-ether-with-usd',
  MEMBERSHIP_INFO = 'general-knowledge/about-mycrypto/membership-information',
  HOW_TO_USE_ZAPPER = 'how-to/defi/how-to-use-zapper',
  WHERE_TO_GET_TESTNET_ETHER = 'how-to/getting-started/where-to-get-testnet-ether',
  WHAT_IS_WALLETCONNECT = 'general-knowledge/ethereum-blockchain/what-is-walletconnect',
  HOW_TO_USE_WALLETCONNECT = 'how-to/accessing-wallet/how-to-use-walletconnect-with-mycrypto',
  TREZOR_TROUBLESHOOTING = 'troubleshooting/hardware-wallets/trezor/unable-to-connect-trezor-hardware-wallet-on-mycrypto',
  LEDGER_TROUBLESHOOTING = 'troubleshooting/hardware-wallets/ledger/ledger-hardware-wallet-unable-to-connect-on-mycrypto',
  WHAT_ARE_PROTECTED_TRANSACTIONS = 'general-knowledge/about-mycrypto/what-are-protected-transactions',
  HOW_DOES_VIEW_ADDRESS_WORK = 'how-to/accessing-wallet/how-does-view-address-work',
  WHY_IS_GAS = 'general-knowledge/ethereum-blockchain/why-is-gas',
  HOW_TO_USE_MYCRYPTO_MORE_PRIVATELY = 'staying-safe/how-to-use-mycrypto-more-privately',
  WHAT_IS_EIP1559 = 'general-knowledge/ethereum-blockchain/what-is-eip-1559',
  WHAT_IS_CONTRACT_ABI = 'general-knowledge/ethereum-blockchain/what-is-contract-abi'
}

export enum HELP_ARTICLE {
  DPATH = 'https://medium.com/mycrypto/wtf-is-a-derivation-path-c3493ca2eb52',
  LEDGER = 'https://support.ledger.com/hc/en-us/articles/360008268594'
}

export const getKBHelpArticle = (article: KB_HELP_ARTICLE) => `${KB_URL}/${article}` as TURL;
