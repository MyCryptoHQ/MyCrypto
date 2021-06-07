import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const config: HardhatUserConfig = {
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

export default config;
