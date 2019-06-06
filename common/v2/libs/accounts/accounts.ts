import { shepherdProvider, INode } from 'libs/nodes';
import { getCache } from 'v2/services/LocalCache';
import { Account, ExtendedAccount } from 'v2/services/Account/types';
import { Asset } from 'v2/services/Asset/types';
import { getAssetByName } from '../assets/assets';
import { fromWei } from '../units';
import BN from 'bn.js';
import { getNetworkByName, getNodeByName } from '../networks/networks';
import { Network } from 'v2/services/Network/types';
import { NodeOptions } from 'v2/services/NodeOptions/types';
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
    return 'err';
  }
};

export const getAccountBalances = (
  accounts: ExtendedAccount[],
  updateAccount: (uuid: string, accountData: ExtendedAccount) => void
): void => {
  accounts.map(async account => {
    const balance: string = fromWei(
      await getAccountBalance(account.address, getNetworkByName(account.network)),
      'ether'
    );
    updateAccount(account.uuid, {
      ...account,
      timestamp: Date.now(),
      balance: parseFloat(balance)
    });
  });
};

export function getNodeLib(): INode {
  return shepherdProvider;
}

export const getAccountBalance = async (
  address: string,
  network: Network | undefined
): Promise<BN> => {
  const nodeOptions: NodeOptions | undefined = getNodeByName(
    network ? network.nodes[0] : 'eth_mycrypto'
  );
  const node: INode = new RpcNode(
    nodeOptions ? nodeOptions.url : 'https://api.mycryptoapi.com/eth'
  );
  if (!network) {
    return new BN(0);
  } else {
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
  if (!network) {
    return undefined;
  }
  return getAssetByName(network.baseAsset);
};

export const getAllAccounts = (): Account[] => {
  return Object.values(getCache().accounts);
};

export const getAllAccountKeys = (): string[] => {
  return Object.keys(getCache().accounts);
};
