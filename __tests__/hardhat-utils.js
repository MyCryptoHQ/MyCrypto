import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';

import { FIXTURE_WEB3_ADDRESS } from './fixtures';

const provider = new JsonRpcProvider('http://127.0.0.1:8546/');

export const resetFork = async (stickyBlockNum = true) => {
  await provider.send('hardhat_reset', [
    {
      forking: {
        jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        blockNumber: stickyBlockNum ? 13373860 : undefined
      }
    }
  ]);
};

const setupERC20 = async (account, contract, amount) => {
  await provider.send('hardhat_impersonateAccount', [account]);

  const signer = await provider.getSigner(account);

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
  const erc20 = new Contract(contract, abi, signer);
  const tx = await erc20.populateTransaction.transfer(FIXTURE_WEB3_ADDRESS, amount);

  await sendTx({ ...tx, from: account });

  await provider.send('hardhat_stopImpersonatingAccount', [account]);
};

// Transfers DAI to the test address
export const setupDAI = async () =>
  setupERC20(
    '0x28c6c06298d514db089934071355e5743bf21d60',
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '100000000000000000000'
  );

// Transfers LEND to the test address
export const setupLEND = async () =>
  setupERC20(
    '0xb4Ad52fBBBb46871C043Cc8B4c074ad8B2a0c83b',
    '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    '100000000000000000000'
  );

export const sendTx = async (tx) => {
  const signer = await provider.getSigner(tx.from);

  const sent = await signer.sendTransaction({
    ...tx,
    maxFeePerGas: '0xe8990a4600',
    maxPriorityFeePerGas: '0xe8990a4600'
  });

  await sent.wait();

  return sent.hash;
};
