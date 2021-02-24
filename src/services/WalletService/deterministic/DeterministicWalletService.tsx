import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import BN from 'bignumber.js';
import flatten from 'ramda/src/flatten';

import {
  BalanceMap,
  getBaseAssetBalancesForAddresses,
  getSingleTokenBalanceForAddresses
} from '@services/Store/BalanceService';
import { ExtendedAsset, Network, TAddress, WalletId } from '@types';
import { bigify } from '@utils';

import { getDeterministicWallets, LedgerUSB, Wallet } from '..';
import { LedgerU2F, Trezor, WalletResult } from '../wallets';
import { KeyInfo } from '../wallets/HardwareWallet';
import {
  DWAccountDisplay,
  ExtendedDPath,
  HardwareInitProps,
  IDeterministicWalletService
} from './types';

interface IPrefetchBundle {
  [key: string]: KeyInfo;
}

interface EventHandlers {
  handleInit(session: Wallet, asset: ExtendedAsset): void;
  handleInitRequest(): void;
  handleAccountsUpdate(accounts: DWAccountDisplay[], asset: ExtendedAsset): void;
  handleEnqueueAccounts(accounts: DWAccountDisplay[]): void;
  handleAccountsError(error: string): void;
  handleAccountsSuccess(): void;
  handleReject(err?: string): void;
  handleComplete(): void;
}

const selectWallet = async (walletId: WalletId) => {
  switch (walletId) {
    default:
    case WalletId.LEDGER_NANO_S_NEW: {
      const isWebUSBSupported = !navigator.platform.includes('Win')
        ? await TransportWebUSB.isSupported().catch(() => false)
        : false;
      return isWebUSBSupported ? new LedgerUSB() : new LedgerU2F(); // @todo - fix the walletId & type
    }
    case WalletId.TREZOR_NEW:
      return new Trezor();
  }
};

export const DeterministicWalletService = ({
  handleInitRequest,
  handleInit,
  handleReject,
  handleAccountsError,
  handleAccountsUpdate,
  handleEnqueueAccounts,
  handleComplete
}: EventHandlers): IDeterministicWalletService => {
  const init = async ({ walletId, asset, dpath }: HardwareInitProps) => {
    const wallet = await selectWallet(walletId);
    wallet
      .initialize(dpath!)
      .then(() => {
        handleInit(wallet, asset);
      })
      .catch((err) => {
        handleReject(err);
      });
    handleInitRequest();
  };

  const triggerComplete = () => {
    handleComplete();
  };

  const getAccounts = async (session: Wallet, dpaths: ExtendedDPath[]) => {
    if (session.prefetch) {
      const prefetchedBundle: IPrefetchBundle = await session.prefetch(dpaths);
      const returnedData = flatten(
        Object.entries(prefetchedBundle).map(([key, value]) => {
          try {
            const dpath = dpaths.find((x) => x.value === key) as ExtendedDPath;
            return getDeterministicWallets({
              dPath: key,
              chainCode: value.chainCode,
              publicKey: value.publicKey,
              limit: dpath.numOfAddresses,
              offset: dpath.offset
            }).map((item) => ({
              address: item.address as TAddress,
              pathItem: {
                path: `${key}/${item.index}`,
                baseDPath: dpath,
                index: item.index
              },
              balance: undefined
            }));
          } catch {
            return [];
          }
        })
      );
      handleEnqueueAccounts(returnedData);
    } else {
      const hardenedDPaths = dpaths.filter(({ isHardened }) => isHardened);
      const normalDPaths = dpaths.filter(({ isHardened }) => !isHardened);
      if (normalDPaths.length > 0) {
        await getDPathAddresses(session, normalDPaths)
          .then((accounts) => {
            handleEnqueueAccounts(accounts);
          })
          .catch((err) => {
            handleAccountsError(err);
          });
      }

      if (hardenedDPaths.length > 0) {
        await getDPathAddresses(session, hardenedDPaths)
          .then((accounts) => {
            handleEnqueueAccounts(accounts);
          })
          .catch((err) => {
            handleAccountsError(err);
          });
      }
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
        ? () => getBaseAssetBalancesForAddresses(addresses, network)
        : () => getSingleTokenBalanceForAddresses(asset, network, addresses);

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

  const getDPathAddresses = async (
    session: Wallet,
    dpaths: ExtendedDPath[]
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: DWAccountDisplay[] = [];
    for (const dpath of dpaths) {
      try {
        for (let idx = 0; idx < dpath.numOfAddresses; idx++) {
          const data = (await session.getAddress(dpath, idx + dpath.offset)) as WalletResult;
          const outputObject = {
            address: data.address as TAddress,
            pathItem: {
              path: data.path,
              baseDPath: dpath,
              index: idx + dpath.offset
            },
            balance: undefined
          };
          outputAddresses.push(outputObject);
        }
        // eslint-disable-next-line no-empty
      } catch {}
    }

    return outputAddresses;
  };

  return {
    init,
    getAccounts,
    handleAccountsQueue,
    triggerComplete
  };
};
export default DeterministicWalletService;
