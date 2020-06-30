import BN from 'bignumber.js';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import flatten from 'ramda/src/flatten';

import { DPathFormat, Network, ExtendedAsset, WalletId, TAddress } from '@types';
import {
  getBaseAssetBalances,
  getTokenAssetBalances,
  BalanceMap
} from '@services/Store/BalanceService';
import { bigify } from '@utils';

import { LedgerU2F, Trezor, MnemonicPhrase } from '../wallets';
import { KeyInfo } from '../wallets/HardwareWallet';
import { LedgerUSB, Wallet, getDeterministicWallets } from '..';
import { IDeterministicWalletService, DWAccountDisplay, ExtendedDPath } from './types';

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
    case WalletId.MNEMONIC_PHRASE_NEW: {
      return new MnemonicPhrase(mnemonic!, pass || '');
    }
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
    const wallet = await selectWallet(walletId, mnemonic, pass);
    wallet
      .initialize()
      .then(() => {
        handleInit(wallet, asset);
      })
      .catch(() => {
        handleReject();
      });
    handleInitRequest();
  };

  interface IPrefetchBundle {
    [key: string]: KeyInfo;
  }

  const getAccounts = async (session: Wallet, dpaths: ExtendedDPath[]) => {
    if (session.prefetch) {
      const prefetchedBundle: IPrefetchBundle = await session.prefetch(dpaths);
      const returnedData = flatten(
        Object.entries(prefetchedBundle).map(([key, value]) => {
          const dpath = dpaths.find((x) => x.value === key) as ExtendedDPath;
          return getDeterministicWallets({
            dPath: key,
            chainCode: value.chainCode,
            publicKey: value.publicKey,
            limit: dpath.numOfAddresses,
            offset: dpath.offset
          }).map((item) => ({
            address: item.address as TAddress,
            path: `${key}/${item.index}`,
            balance: undefined
          }));
        })
      );
      handleEnqueueAccounts(returnedData);
    } else {
      const hardenedDPaths = dpaths.filter(({ isHardened }) => isHardened);
      const normalDPaths = dpaths.filter(({ isHardened }) => !isHardened);
      await getNormalDPathAddresses(session, normalDPaths)
        .then((accounts) => {
          handleEnqueueAccounts(accounts);
        })
        .catch((err) => {
          handleAccountsError(err);
        });

      await getHardenedDPathAddresses(session, hardenedDPaths)
        .then((accounts) => {
          handleEnqueueAccounts(accounts);
        })
        .catch((err) => {
          handleAccountsError(err);
        });
    }
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
    } catch (err) {
      handleAccountsUpdate(accounts, asset);
    }
  };

  const getNormalDPathAddresses = async (
    session: Wallet,
    dpaths: ExtendedDPath[]
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: any[] = [];
    for (const dpath of dpaths) {
      for (let idx = 0; idx < dpath.numOfAddresses; idx++) {
        const data = await session.getAddress(dpath, idx + dpath.offset);
        outputAddresses.push(data);
      }
    }
    return outputAddresses;
  };

  const getHardenedDPathAddresses = async (
    session: Wallet,
    dpaths: ExtendedDPath[]
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: any[] = [];
    for (const dpath of dpaths) {
      for (let idx = 0; idx < dpath.numOfAddresses; idx++) {
        await session.getAddress(dpath, idx + dpath.offset).then((data: any) => {
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
