import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
import BN from 'bignumber.js';

import {
  BalanceMap,
  getBaseAssetBalancesForAddresses,
  getSingleTokenBalanceForAddresses
} from '@services/Store/BalanceService';
import { ExtendedAsset, Network, WalletId } from '@types';
import { bigify } from '@utils';

import { LedgerUSB, Wallet } from '..';
import { LedgerU2F, Trezor } from '../wallets';
import {
  DWAccountDisplay,
  ExtendedDPath,
  HardwareInitProps,
  IDeterministicWalletService
} from './types';

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
      const isWebUSBSupported = await TransportWebUSB.isSupported().catch(() => false);
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
    // Trezor wallet uses getMultipleAddresses for fetching multiple addresses at a time. Ledger doesn't have this functionality.
    if (session.getMultipleAddresses) {
      await session
        .getMultipleAddresses(dpaths)
        .then((accounts) => handleEnqueueAccounts(accounts))
        .catch((e) => {
          handleAccountsError(e);
        });
    } else {
      console.error(`[getAccounts]: Selected HD wallet type has no getMultipleAddresses method`);
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

  return {
    init,
    getAccounts,
    handleAccountsQueue,
    triggerComplete
  };
};
export default DeterministicWalletService;
