import BN from 'bn.js';
import { INode, shepherdProvider } from 'libs/nodes';
import MyCryptoProvider from 'v2/config/networks/providerHandler';
import { Account, ExtendedAccount } from 'v2/services/Account/types';
import { Asset } from 'v2/services/Asset/types';
import { getCache } from 'v2/services/LocalCache';
import { Network, NodeOptions } from 'v2/services/Network/types';
import { getAssetByUUID } from '../assets/assets';
import { getNetworkByName, getNodesByNetwork } from '../networks/networks';
import RpcNode from '../nodes/rpc';

export const getCurrentsFromContext = (
  accounts: ExtendedAccount[],
  currentAccounts: string[]
): ExtendedAccount[] => {
  const accountList: ExtendedAccount[] = [];
  currentAccounts.map(en => {
    const relevantAccount: ExtendedAccount | undefined = accounts.find(
      account => account.uuid === en
    );
    if (relevantAccount) {
      accountList.push(relevantAccount);
    }
  });
  return accountList;
};

export const getBalanceFromAccount = (account: ExtendedAccount): string => {
  const baseAsset = getBaseAssetFromAccount(account);
  if (baseAsset) {
    return account.balance.toString();
  } else {
    return '0';
  }
};

export const getTokenBalanceFromAccount = (account: ExtendedAccount, asset: Asset): string => {
  const balanceFound = account.assets.find(entry => entry.uuid === asset.uuid);
  return balanceFound ? balanceFound.balance.toString() : '0';
};

/* TODO: Refactor this */
export const getAccountBalances = (
  accounts: ExtendedAccount[],
  updateAccount: (uuid: string, accountData: ExtendedAccount) => void
): void => {
  accounts.forEach(async account => {
    const network = getNetworkByName(account.network);
    if (network) {
      const provider = new MyCryptoProvider(network);
      const balance: string = await provider.getBalance(account.address);
      updateAccount(account.uuid, {
        ...account,
        timestamp: Date.now(),
        balance
      });
    }
  });
};

export const updateTokenBalanceByAsset = (
  account: ExtendedAccount,
  asset: Asset,
  updateAccount: (uuid: string, accountData: ExtendedAccount) => void
): void => {
  const network = getNetworkByName(account.network);
  if (network) {
    const provider = new MyCryptoProvider(network);
    provider.getTokenBalance(account.address, asset).then(data => {
      const assets = account.assets.map(
        prevAsset =>
          asset.uuid === prevAsset.uuid
            ? { ...prevAsset, balance: data, timestamp: Date.now() }
            : prevAsset
      );
      updateAccount(account.uuid, {
        ...account,
        assets
      });
    });
  }
};

export function getNodeLib(): INode {
  return shepherdProvider;
}

export const getAccountBalance = async (
  address: string,
  network: Network | undefined
): Promise<BN> => {
  if (!network) {
    return new BN(0);
  } else {
    const nodeOptions: NodeOptions[] = getNodesByNetwork(network.name);
    if (!nodeOptions) {
      return new BN(0);
    }
    const node: INode = new RpcNode(nodeOptions[0].url);
    const num = await node.getBalance(address);
    return num;
  }
};

export const getAccountByAddress = (address: string): ExtendedAccount | undefined => {
  const accountKeys = getAllAccountKeys();
  accountKeys.map(key => {
    const account: Account = getCache().accounts[key];
    if (account.address === address) {
      const newAccount: ExtendedAccount = {
        ...account,
        uuid: key
      };
      return newAccount;
    }
  });
  return undefined;
};

export const getBaseAssetFromAccount = (account: ExtendedAccount): Asset | undefined => {
  const network: Network | undefined = getNetworkByName(account.network);
  if (network) {
    return getAssetByUUID(network.baseAsset);
  }
};

export const getAllAccounts = (): Account[] => {
  return Object.values(getCache().accounts);
};

export const getAllAccountKeys = (): string[] => {
  return Object.keys(getCache().accounts);
};
