import { HardhatUserConfig } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers';
import 'dotenv/config';

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      chainId: 1,
      hardfork: 'london',
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 13373860
      },
      accounts: {
        mnemonic: 'test test test test test test test test test test test ball'
      }
    }
  },
  paths: {
    cache: './.cache/hardhat'
  }
};

export default config;
