import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

import { FIXTURE_WEB3_ADDRESS } from './fixtures';

export const resetFork = async () => {
  const provider = new JsonRpcProvider('http://127.0.0.1:8546/');

  await provider.send('hardhat_reset', [
    {
      forking: {
        jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: 12651850
      }
    }
  ]);
};

// Transfers DAI to the test address
export const setupDAI = async () => {
  const provider = new JsonRpcProvider('http://127.0.0.1:8546/');

  await provider.send('hardhat_impersonateAccount', ['0x28c6c06298d514db089934071355e5743bf21d60']);

  const signer = await provider.getSigner('0x28c6c06298d514db089934071355e5743bf21d60');

  const abi = [
    // Read-Only Functions
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function symbol() view returns (string)',

    // Authenticated Functions
    'function transfer(address to, uint amount) returns (boolean)',

    // Events
    'event Transfer(address indexed from, address indexed to, uint amount)'
  ];

  // send ERC20
  const erc20 = new Contract('0x6b175474e89094c44da98b954eedeac495271d0f', abi, signer);
  const tx = await erc20.populateTransaction.transfer(
    FIXTURE_WEB3_ADDRESS,
    '100000000000000000000'
  );
  const sent = await signer.sendTransaction(tx);

  await sent.wait();

  await provider.send('hardhat_stopImpersonatingAccount', [
    '0x28c6c06298d514db089934071355e5743bf21d60'
  ]);
};
