export default {
  serverURL: 'https://bity.myetherapi.com',
  bityAPI: 'https://bity.com/api',
  ethExplorer: 'https://etherscan.io/tx/[[txHash]]',
  btcExplorer: 'https://blockchain.info/tx/[[txHash]]',
  validStatus: ['RCVE', 'FILL', 'CONF', 'EXEC'],
  invalidStatus: ['CANC'],
  mainPairs: ['REP', 'ETH'],
  BTCMin: 0.01,
  BTCMax: 3,
  priceLoaded: false,
  postConfig: {
    headers: {
      'Content-Type': 'application/json; charset:UTF-8'
    }
  }
};
