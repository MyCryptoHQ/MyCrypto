import BN from 'bn.js';

import { shepherdProvider } from 'libs/nodes';
import { Account, Asset, ExtendedAccount, Network, NodeOptions, INode } from 'v2/types';
import { getAssetByUUID, getNetworkByName, getNodesByNetwork } from 'v2/services/Store';
import { getCache } from '../LocalCache';
import { RPCNode, ProviderHandler } from 'v2/services/EthService';

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

export const getTokenBalanceFromAccount = (account: ExtendedAccount, asset?: Asset): string => {
  if (!asset) {
    return '0';
  }
  const balanceFound = account.assets.find(entry => entry.uuid === asset.uuid);
  return balanceFound ? balanceFound.balance.toString() : '0';
};

/* TODO: Refactor this */
export const getAccountBalances = (
  accounts: ExtendedAccount[],
  updateAccount: (uuid: string, accountData: ExtendedAccount) => void
): void => {
  accounts.forEach(async account => {
    const network = getNetworkByName(account.networkId);
    if (network) {
      const provider = new ProviderHandler(network);
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
  const network = getNetworkByName(account.networkId);
  if (network) {
    const provider = new ProviderHandler(network);
    provider.getTokenBalance(account.address, asset).then(data => {
      const assets = account.assets.map(prevAsset =>
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
    const node: INode = new RPCNode(nodeOptions[0].url);
    const num = await node.getBalance(address);
    return num;
  }
};

// Returns an account if it exists
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
  const network: Network | undefined = getNetworkByName(account.networkId);
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

export const getAccountByAddressAndNetworkName = (
  address: string,
  networkName: string
): ExtendedAccount | undefined => {
  const accountKeys = getAllAccountKeys();
  const accounts = getCache().accounts;
  accountKeys.map(key => {
    const account: Account = accounts[key];
    if (
      account.address.toLowerCase() === address.toLowerCase() &&
      account.networkId === networkName
    ) {
      const newAccount: ExtendedAccount = {
        ...account,
        uuid: key
      };
      return newAccount;
    }
  });
  return undefined;
};
