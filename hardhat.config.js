require('@nomiclabs/hardhat-ethers');

module.exports = {
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/TPLd_8YqDbqK1_ciMrFF2URz6_mjbifb`
      },
      accounts: {
        mnemonic: 'test test test test test test test test test test test ball'
      }
    }
  }
};
