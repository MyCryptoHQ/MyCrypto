export const makeNodeName = (network: string, name: string) => {
  return `${network.toLowerCase()}_${name}`;
};

function makeEtherscanOption(network: 'homestead' | 'ropsten' | 'rinkeby' | 'kovan' | 'goerli') {
  return `etherscan+${network}`;
}

export const PROVIDER_OPTIONS = {
  Ethereum: [
    'https://api.mycryptoapi.com/eth',
    makeEtherscanOption('homestead'), //etherscan
    'https://mainnet.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'
  ],

  Ropsten: ['https://ropsten.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286'],

  Kovan: [makeEtherscanOption('kovan')],

  Rinkeby: [
    'https://rinkeby.infura.io/v3/c02fff6b5daa434d8422b8ece54c7286',
    makeEtherscanOption('rinkeby')
  ],

  Goerli: ['https://goerli.mycryptoapi.com', makeEtherscanOption('goerli')],

  ETC: ['https://ethereumclassic.network'],

  RSK: ['https://mycrypto.rsk.co/'],

  AKA: ['https://remote.akroma.io', 'https://rpc.akroma.io'],

  AQUA: ['https://tx.aquacha.in/api', 'https://c.onical.org'],

  ARTIS_SIGMA1: [, 'https://rpc.sigma1.artis.network'],

  ARTIS_TAU1: ['https://rpc.tau1.artis.network'],

  ATH: ['https://wallet.atheios.com:8797'],

  CLO: ['https://clo-geth.0xinfra.com/', 'https://node.clopool.net/'],

  DEXON: ['https://mainnet-rpc.dexon.org'],

  EGEM: ['https://jsonrpc.egem.io/custom'],

  ELLA: ['https://jsonrpc.ellaism.org'],

  EOSC: ['https://node.eos-classic.io/'],

  ESN: ['https://api.esn.gonspool.com'],

  ETHO: ['https://rpc.ether1.org'],

  ETSC: ['https://node.ethereumsocial.kr'],

  EXP: ['https://node.expanse.tech/'],

  Gangnam: ['https://rpc.progtest.net'],

  GO: ['https://rpc.gochain.io/'],

  GO_TESTNET: ['https://testnet-rpc.gochain.io/'],

  METADIUM: ['https://api.metadium.com/prod'],

  MIX: ['https://rpc2.mix-blockchain.org:8647'],

  MUSIC: ['https://mewapi.musicoin.tw'],

  PIRL: ['https://wallrpc.pirl.io'],

  POA: ['https://core.poa.network'],

  REOSC: ['https://remote.reosc.io:3000'],

  RSK_TESTNET: ['https://mycrypto.testnet.rsk.co/'],

  SOLIDUM: ['https://rpc.solidum.network'],

  THUNDERCORE: ['https://mainnet-rpc.thundercore.com'],

  TOMO: ['https://rpc.tomochain.com'],

  UBQ: ['https://rpc1.ubiqscan.io'],

  WEB: ['https://node1.webchain.network', 'https://node2.webchain.network']
};

export default PROVIDER_OPTIONS;
