import { bigNumberify, BigNumber } from 'ethers/utils';
import BN from 'bn.js';

import {
  Account,
  Asset,
  ExtendedAccount,
  StoreAccount,
  Network,
  NodeOptions,
  INode
} from 'v2/types';
import {
  getAssetByUUID,
  getNetworkByName,
  getNetworkById,
  getNodesByNetwork
} from 'v2/services/Store';
import { RPCNode, ProviderHandler } from 'v2/services/EthService';
import { readSection } from '../Cache';

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

export const getDashboardAccounts = (
  accounts: StoreAccount[],
  currentAccounts: string[]
): StoreAccount[] => {
  return accounts
    .filter(account => account && 'uuid' in account)
    .filter(({ uuid }) => currentAccounts.indexOf(uuid) >= 0);
};

export const getBalanceFromAccount = (account: ExtendedAccount): string => {
  const baseAssetUuid = getBaseAssetFromAccount(account)!.uuid;
  const baseAsset = account.assets.find(a => a.uuid === baseAssetUuid);
  const value = baseAsset ? baseAsset.balance : bigNumberify(0);
  return value.toString();
};

export const getTokenBalanceFromAccount = (account: ExtendedAccount, asset?: Asset): string => {
  if (!asset) {
    return '0';
  }
  const balanceFound = account.assets.find(entry => entry.uuid === asset.uuid);
  return balanceFound ? balanceFound.balance.toString() : '0';
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

export const getAccountBaseBalance = (account: StoreAccount) =>
  account.assets.find(a => a.type === 'base')!.balance;

export const getAccountBalance = async (
  address: string,
  network: Network | undefined
): Promise<BigNumber | BN> => {
  if (!network) {
    return bigNumberify(0);
  } else {
    const nodeOptions: NodeOptions[] = getNodesByNetwork(network.name);
    if (!nodeOptions) {
      return bigNumberify(0);
    }
    const node: INode = new RPCNode(nodeOptions[0].url);
    const num = await node.getBalance(address);
    return num;
  }
};

// Returns an account if it exists
export const getAccountByAddress = (address: string): ExtendedAccount | undefined => {
  const accountKeys = getAllAccountKeys();
  const accounts = getAllAccounts();
  accountKeys.map(key => {
    const account: Account = accounts[key];
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
  const network: Network | undefined = getNetworkById(account.networkId);
  if (network) {
    return getAssetByUUID(network.baseAsset);
  }
};

export const getAllAccounts = (): Record<string, Account> => {
  return readSection('accounts')();
};

export const getAllAccountKeys = (): string[] => {
  return Object.keys(readSection('accounts')());
};

export const getAccountByAddressAndNetworkName = (
  address: string,
  networkName: string
): ExtendedAccount | undefined => {
  const accountKeys = getAllAccountKeys();
  const accounts = readSection('accounts')();
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

export const getAccountsByAsset = (
  accounts: StoreAccount[],
  { uuid: targetUuid }: Asset
): StoreAccount[] =>
  accounts.filter(({ assets }) => assets.find(({ uuid }) => uuid === targetUuid));

export const getBaseAsset = (account: StoreAccount) => account.assets.find(a => a.type === 'base');
