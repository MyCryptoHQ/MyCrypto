import BN from 'bignumber.js';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

import { DPathFormat, Network, ExtendedAsset, WalletId } from '@types';
import {
  getBaseAssetBalances,
  getTokenAssetBalances,
  BalanceMap
} from '@services/Store/BalanceService';
import { bigify } from '@utils';

import { LedgerUSB, Wallet } from '..';
import { IDeterministicWalletService, DWAccountDisplay } from './types';
import { LedgerU2F, Trezor, MnemonicPhrase } from '../wallets';

interface EventHandlers {
  walletId: DPathFormat;
  handleInit(session: Wallet, asset: ExtendedAsset): void;
  handleInitRequest(): void;
  handleAccountsUpdate(accounts: DWAccountDisplay[], asset: ExtendedAsset): void;
  handleEnqueueAccounts(accounts: DWAccountDisplay[]): void;
  handleAccountsError(error: string): void;
  handleAccountsSuccess(): void;
  handleReject(): void;
}

const selectWallet = async (walletId: WalletId, mnemonic?: string, pass?: string) => {
  switch (walletId) {
    default:
    case WalletId.LEDGER_NANO_S_NEW:
      const isWebUSBSupported = !navigator.platform.includes('Win')
        ? await TransportWebUSB.isSupported().catch(() => false)
        : false;
      return isWebUSBSupported ? new LedgerUSB() : new LedgerU2F(); // @todo - fix the walletId & type
    case WalletId.TREZOR_NEW:
      return new Trezor();
    case WalletId.MNEMONIC_PHRASE_NEW:
      return new MnemonicPhrase(mnemonic!, pass! || '');
  }
};

export const DeterministicWalletService = ({
  handleInitRequest,
  handleInit,
  handleReject,
  handleAccountsError,
  handleAccountsUpdate,
  handleEnqueueAccounts
}: // walletId
EventHandlers): IDeterministicWalletService => {
  const init = async (
    walletId: WalletId,
    asset: ExtendedAsset,
    mnemonic?: string,
    pass?: string
  ) => {
    console.debug('[here]: ', walletId, asset, mnemonic, pass);
    const wallet = await selectWallet(walletId, mnemonic, pass);
    wallet
      .initialize()
      .then(() => {
        console.debug('[handleInit]');
        handleInit(wallet, asset);
      })
      .catch((e) => {
        console.debug('[handleReject] ', e);
        handleReject();
      });
    console.debug('[handleInitReq]');
    handleInitRequest();
  };

  const getAccounts = async (
    session: Wallet,
    dpaths: DPath[],
    numOfAddresses: number,
    offset: number
  ) => {
    console.debug('[DeterministicWalletService]: getAccounts');
    const hardenedDPaths = dpaths.filter(({ isHardened }) => isHardened);
    const normalDPaths = dpaths.filter(({ isHardened }) => !isHardened);

    await getNormalDPathAddresses(session, normalDPaths, numOfAddresses, offset)
      .then((accounts) => {
        handleEnqueueAccounts(accounts);
      })
      .catch((err) => {
        handleAccountsError(err);
      });

    await getHardenedDPathAddresses(session, hardenedDPaths, numOfAddresses, offset)
      .then((accounts) => {
        handleEnqueueAccounts(accounts);
      })
      .catch((err) => {
        handleAccountsError(err);
      });
  };

  const handleAccountsQueue = (
    accounts: DWAccountDisplay[],
    network: Network,
    asset: ExtendedAsset
  ) => {
    const addresses = accounts.map(({ address }) => address);
    const balanceLookup =
      asset.type === 'base'
        ? () => getBaseAssetBalances(addresses, network)
        : () => getTokenAssetBalances(addresses, network, asset);

    try {
      balanceLookup().then((balanceMapData: BalanceMap<BN>) => {
        const walletsWithBalances: DWAccountDisplay[] = accounts.map((account) => {
          const balance = balanceMapData[account.address] || 0; // @todo - better error handling for failed lookups.
          return {
            ...account,
            balance: bigify(balance.toString())
          };
        });
        handleAccountsUpdate(walletsWithBalances, asset);
      });
    } catch {
      handleAccountsUpdate(accounts, asset);
    }
  };

  const getNormalDPathAddresses = async (
    session: Wallet,
    dpaths: DPath[],
    numOfAddresses: number,
    offset: number
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: any[] = [];
    for (const dpath of dpaths) {
      for (let idx = 0; idx < numOfAddresses; idx++) {
        const data = await session.getAddress(dpath, idx + offset);
        outputAddresses.push(data);
      }
    }
    return outputAddresses;
  };

  const getHardenedDPathAddresses = async (
    session: Wallet,
    dpaths: DPath[],
    numOfAddresses: number,
    offset: number
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: any[] = [];
    for (const dpath of dpaths) {
      for (let idx = 0; idx < numOfAddresses; idx++) {
        await session.getAddress(dpath, idx + offset).then((data: any) => {
          // @todo - fix this type
          outputAddresses.push(data);
        });
      }
    }
    return outputAddresses;
  };

  return {
    init,
    getAccounts,
    handleAccountsQueue
  };
};
export default DeterministicWalletService;
