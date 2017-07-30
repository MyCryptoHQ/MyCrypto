export default {
  serverURL: 'https://bity.myetherapi.com',
  bityAPI: 'https://bity.com/api',
  ethExplorer: 'https://etherscan.io/tx/[[txHash]]',
  btcExplorer: 'https://blockchain.info/tx/[[txHash]]',
  validStatus: ['RCVE', 'FILL', 'CONF', 'EXEC'],
  invalidStatus: ['CANC'],
  // while Bity is supposedly OK with any order that is at least 0.01 BTC Worth, the order will fail if you send 0.01 BTC worth of ETH.
  // This is a bad magic number, but will suffice for now
  ETHBuffer: 0.1, // percent higher/lower than 0.01 BTC worth
  REPBuffer: 0.2, // percent higher/lower than 0.01 BTC worth
  BTCMin: 0.01,
  BTCMax: 3,
  ETHMin: function(BTCETHRate: number) {
    const ETHMin = BTCETHRate * this.BTCMin;
    const ETHMinWithPadding = ETHMin + ETHMin * this.ETHBuffer;
    return ETHMinWithPadding;
  },
  ETHMax: function(BTCETHRate: number) {
    const ETHMax = BTCETHRate * this.BTCMax;
    const ETHMaxWithPadding = ETHMax - ETHMax * this.ETHBuffer;
    return ETHMaxWithPadding;
  },
  REPMin: function(BTCREPRate: number) {
    const REPMin = BTCREPRate * this.BTCMin;
    const REPMinWithPadding = REPMin + REPMin * this.REPBuffer;
    return REPMinWithPadding;
  },
  REPMax: function(BTCREPRate: number) {
    const REPMax = BTCREPRate * this.BTCMax;
    const REPMaxWithPadding = REPMax - REPMax * this.ETHBuffer;
    return REPMaxWithPadding;
  },
  postConfig: {
    headers: {
      'Content-Type': 'application/json; charset:UTF-8'
    }
  }
};
