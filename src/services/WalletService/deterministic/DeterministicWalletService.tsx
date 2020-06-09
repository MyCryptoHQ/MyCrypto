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
  handleAccountsError(error: string): void;
  handleAccountsSuccess(): void;
  handleReject(): void;
}

export const DeterministicWalletService = ({
  handleInitRequest,
  handleInit,
  handleReject,
  handleAccountsError,
  handleAccountsUpdate
}: // walletId
EventHandlers): IDeterministicWalletService => {
  const init = async () => {
    const wallet = new LedgerUSB() as Wallet; // @todo - fix the walletId & type
    wallet
      .initialize()
      .then((res: any) => {
        console.debug('[init]: res', res);
        handleInit(wallet);
      })
      .catch((err: any) => {
        console.debug('[init]: err', err);
        handleReject();
      });
    handleInitRequest();
  };

  // const connect = async (network: Network, walletId: DPathFormat) => {
  // 	const dDathTouse = getDPath(
  // 		network,
  // 		walletId
  // 	) as DPath
  // 	getWalletInstance()
  // 	.then((data) => {
  // 		console.debug('data: ', data)
  // 		if (data) {
  // 			data.getAddress(makeFindEthDPath(dDathTouse), 0).then(address => {
  // 				console.debug('[address found in connect]: address -> ', address)
  // 				handleConnect(address)
  // 			})
  // 		}
  // 	})
  // }

  // const getAllAccounts = async(dpaths: DPath[], numOfAddresses: number) => {
  // 	numOfAddresses
  // }

  const getAccounts = (
    session: Wallet,
    dpath: DPath,
    numOfAddresses: number,
    offset: number,
    network: Network
  ) => {
    console.debug('[here]: ');
    const fetchAccounts = dpath.isHardened
      ? () => getHardenedDPathAddresses(session, dpath, numOfAddresses, offset)
      : () => getNormalDPathAddresses(session, dpath, numOfAddresses, offset);
    fetchAccounts()
      .then((accounts) => {
        console.debug('[fetchAccounts]: SUCCESS1 accounts: ', accounts);
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
      })
      .catch((err) => {
        console.debug('[fetchAccounts]: FAIL err: ', err);
        handleAccountsError(err);
      });
  };

  const getNormalDPathAddresses = async (
    session: Wallet,
    dpath: DPath,
    numOfAddresses: number,
    offset: number
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: any[] = [];
    for (let idx = 0; idx < numOfAddresses; idx++) {
      await session.getAddress(dpath, idx + offset).then((data: any) => {
        // @todo
        outputAddresses.push(data);
      });
    }
    return outputAddresses;
  };

  const getHardenedDPathAddresses = async (
    session: Wallet,
    dpath: DPath,
    numOfAddresses: number,
    offset: number
  ): Promise<DWAccountDisplay[]> => {
    const outputAddresses: any[] = [];
    for (let idx = 0; idx < numOfAddresses; idx++) {
      await session.getAddress(dpath, idx + offset).then((data: any) => {
        // @todo
        outputAddresses.push(data);
      });
    }
    return outputAddresses;
  };

  return {
    init,
    getAccounts
  };
};
export default DeterministicWalletService;
