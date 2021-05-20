import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { getByTestId } from '@testing-library/testcafe';
import { Selector, t } from 'testcafe';

//import { default as hardhatConfig } from '../hardhat.config';
import BasePage from './base-page.po';
import { setupEthereumMock } from './ethereum-mock';
import {
  FIXTURE_HARDHAT_PRIVATE_KEY,
  FIXTURE_SEND_AMOUNT,
  FIXTURE_WEB3_ADDRESS,
  PAGES
} from './fixtures';

export default class SwapPage extends BasePage {
  async navigateToPage() {
    this.navigateTo(PAGES.SWAP);
  }

  async waitPageLoaded(timeout) {
    await this.waitForPage(PAGES.SWAP, timeout);
  }

  async fillForm() {
    await t.typeText(Selector('input[name="swap-from"]').parent(), FIXTURE_SEND_AMOUNT);
  }

  async fillFormERC20() {
    await t.click(getByTestId('asset-selector-option-ETH'));
    await t.click(getByTestId('asset-selector-option-DAI'));
    await t.typeText(Selector('input[name="swap-from"]').parent(), FIXTURE_SEND_AMOUNT);
  }

  async resetFork() {
    const provider = new JsonRpcProvider('http://127.0.0.1:8546/');

    await provider.send('hardhat_reset', [
      {
        forking: {
          jsonRpcUrl: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`
        }
      }
    ]);
  }

  async setupMock() {
    await setupEthereumMock(FIXTURE_HARDHAT_PRIVATE_KEY, 1);
  }

  // Transfers DAI to the test address
  async setupERC20() {
    const provider = new JsonRpcProvider('http://127.0.0.1:8546/');

    await provider.send('hardhat_impersonateAccount', [
      '0xf977814e90da44bfa03b6295a0616a897441acec'
    ]);

    const signer = await provider.getSigner('0xf977814e90da44bfa03b6295a0616a897441acec');

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
      '0xf977814e90da44bfa03b6295a0616a897441acec'
    ]);
  }
}
