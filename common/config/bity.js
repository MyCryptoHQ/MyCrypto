export default {
  SERVERURL: 'https://myetherapi.com',
  bityAPI: 'https://bity.com/api',
  decimals: 6,
  ethExplorer: 'https://etherscan.io/tx/[[txHash]]',
  btcExplorer: 'https://blockchain.info/tx/[[txHash]]',
  validStatus: ['RCVE', 'FILL', 'CONF', 'EXEC'],
  invalidStatus: ['CANC'],
  mainPairs: ['REP', 'ETH'],
  min: 0.01,
  max: 3,
  priceLoaded: false,
  postConfig: {
    headers: {
      'Content-Type': 'application/json; charse:UTF-8'
    }
  }
};
