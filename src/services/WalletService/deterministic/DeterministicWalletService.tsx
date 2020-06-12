import BN from 'bignumber.js';
import { IDeterministicWalletService, DWAccountDisplay } from './types';
import { DPathFormat, Network, ExtendedAsset, WalletId } from '@types';
import { LedgerUSB, Wallet } from '..';
import {
  getBaseAssetBalances,
  getTokenAssetBalances,
  BalanceMap
} from '@services/Store/BalanceService';
import { bigify } from '@utils';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import { LedgerU2F } from '../wallets';

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

export const DeterministicWalletService = ({
  handleInitRequest,
  handleInit,
  handleReject,
  handleAccountsError,
  handleAccountsUpdate,
  handleEnqueueAccounts
}: // walletId
EventHandlers): IDeterministicWalletService => {
  const init = async (_: WalletId, asset: ExtendedAsset) => {
    const isWebUSBSupported = !navigator.platform.includes('Win')
      ? await TransportWebUSB.isSupported().catch(() => false)
      : false;
    console.debug('[isWebUSBSupported]: ', isWebUSBSupported);
    const wallet = isWebUSBSupported ? new LedgerUSB() : new LedgerU2F(); // @todo - fix the walletId & type
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

  const getAccounts = async (
    session: Wallet,
    dpaths: DPath[],
    numOfAddresses: number,
    offset: number
  ) => {
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
        console.debug('[balanceLookup]: results ', balanceMapData);
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
