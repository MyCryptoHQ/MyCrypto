import TrezorConnect from 'trezor-connect';

import { DPathsList } from '@config/dpaths';

import Trezor from './Trezor';

jest.mock('trezor-connect');

describe('Trezor', () => {
  it('generates an address from a derivation path', async () => {
    const wallet = new Trezor();
    await wallet.initialize();

    expect(TrezorConnect.manifest).toHaveBeenCalledTimes(1);

    await expect(wallet.getAddress(DPathsList.ETH_DEFAULT, 10)).resolves.toMatchSnapshot();
    await expect(wallet.getAddress(DPathsList.ETH_DEFAULT, 15)).resolves.toMatchSnapshot();
  });

  it('generates an address from a hardened derivation path', async () => {
    const wallet = new Trezor();
    await wallet.initialize();

    expect(TrezorConnect.manifest).toHaveBeenCalledTimes(2);

    await expect(wallet.getAddress(DPathsList.ETH_LEDGER_LIVE, 10)).resolves.toMatchSnapshot();
    await expect(wallet.getAddress(DPathsList.ETH_LEDGER_LIVE, 15)).resolves.toMatchSnapshot();
  });

  it('pre-fetches multiple addresses', async () => {
    const wallet = new Trezor();
    await wallet.initialize();

    const paths = [DPathsList.ETH_DEFAULT, DPathsList.ETH_TESTNET];

    await expect(wallet.prefetch(paths)).resolves.toMatchSnapshot();
  });
});
