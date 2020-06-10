import { IDeterministicWalletService, DWAccountDisplay } from './types';
import { DPathFormat, Network } from '@types';
import { LedgerUSB, Wallet } from '..';
import { getBaseAssetBalances } from '@services/Store/BalanceService';
import { bigify } from '@utils';

interface EventHandlers {
  walletId: DPathFormat;
  handleInit(session: Wallet): void;
  handleInitRequest(): void;
  handleAccountsUpdate(accounts: DWAccountDisplay[]): void;
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
  const init = async () => {
    const wallet = new LedgerUSB() as Wallet; // @todo - fix the walletId & type
    wallet
      .initialize()
      .then(() => {
        handleInit(wallet);
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

  const handleAccountsQueue = (accounts: DWAccountDisplay[], network: Network) => {
    try {
      getBaseAssetBalances(
        accounts.map(({ address }) => address),
        network
      ).then((balanceMapData) => {
        const walletsWithBalances: DWAccountDisplay[] = accounts.map((account) => {
          const balance = balanceMapData[account.address] || 0;
          return {
            ...account,
            balance: bigify(balance.toString())
          };
        });
        handleAccountsUpdate(walletsWithBalances);
      });
    } catch {
      handleAccountsUpdate(accounts);
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
