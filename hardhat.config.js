require('@nomiclabs/hardhat-ethers');

module.exports = {
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
      },
      accounts: {
        mnemonic: 'test test test test test test test test test test test ball'
      }
    }
  }
};
